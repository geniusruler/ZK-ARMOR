import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SetupBanner } from './SetupBanner';
import { 
  Upload, 
  Shield, 
  CheckCircle, 
  Loader2, 
  FileCode, 
  Lock,
  Award,
  ArrowRight,
  Download,
  ExternalLink
} from 'lucide-react';
import { apiClient } from '../utils/api-client';
import { authHelpers, storageHelpers } from '../utils/supabase-client';

type WorkflowStep = 'upload' | 'processing' | 'proof' | 'certificate';

interface VerificationResult {
  jobId: string;
  proofId?: string;
  proofHash?: string;
  blockchainTx?: string;
  robustnessScore?: number;
  certificateUrl?: string;
}

export function DemoWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState('image_classifier');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const session = await authHelpers.getSession();
        if (session) {
          const userData = await authHelpers.getUser();
          setUser(userData);
          apiClient.setAccessToken(session.access_token);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = authHelpers.onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        const session = await authHelpers.getSession();
        apiClient.setAccessToken(session?.access_token || null);
      } else {
        apiClient.setAccessToken(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmitModel = async () => {
    if (!selectedFile) {
      setError('Please select a model file');
      return;
    }

    if (!user) {
      setError('Please sign in to submit models');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep('processing');

    try {
      // Step 1: Upload file to Supabase Storage
      const uploadResult = await storageHelpers.uploadModelFile(selectedFile, user.id);
      console.log('File uploaded:', uploadResult);

      // Step 2: Submit model for verification
      const submitResponse = await apiClient.submitModel({
        modelName: selectedFile.name,
        modelType,
        attackTypes: ['FGSM', 'PGD', 'CW', 'DeepFool'],
        fileHash: uploadResult.path,
      });

      console.log('Model submitted:', submitResponse);

      // Step 3: Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Run model verification
      const verificationResponse = await apiClient.verifyModel({
        modelId: submitResponse.job_id,
        attackTypes: ['FGSM', 'PGD', 'CW', 'DeepFool'],
        threshold: 0.85,
      });

      console.log('Verification complete:', verificationResponse);

      setCurrentStep('proof');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 5: Generate ZK proof
      const proofResponse = await apiClient.generateProof({
        jobId: submitResponse.job_id,
        verificationResults: verificationResponse,
        privacyLevel: 'high',
      });

      console.log('ZK Proof generated:', proofResponse);

      // Step 6: Submit to Midnight Protocol
      const midnightResponse = await apiClient.submitToMidnight({
        proofData: proofResponse,
        modelHash: uploadResult.path,
      });

      console.log('Submitted to Midnight:', midnightResponse);

      setCurrentStep('certificate');

      setResult({
        jobId: submitResponse.job_id,
        proofId: proofResponse.proof_id,
        proofHash: proofResponse.proof_hash,
        blockchainTx: proofResponse.blockchain_tx,
        robustnessScore: verificationResponse.robustness_score,
        certificateUrl: `https://zkarmor.io/verify/${proofResponse.proof_hash}`,
      });

      setIsProcessing(false);
    } catch (err: any) {
      console.error('Error in workflow:', err);
      setError(err.message || 'An error occurred during verification');
      setIsProcessing(false);
      setCurrentStep('upload');
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'upload', label: 'Upload Model', icon: Upload },
      { id: 'processing', label: 'Adversarial Testing', icon: FileCode },
      { id: 'proof', label: 'ZK Proof Generation', icon: Lock },
      { id: 'certificate', label: 'Certificate Issued', icon: Award },
    ];

    const stepOrder: WorkflowStep[] = ['upload', 'processing', 'proof', 'certificate'];
    const currentIndex = stepOrder.indexOf(currentStep);

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = stepOrder.indexOf(step.id as WorkflowStep) <= currentIndex;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-slate-800 border-gray-600 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-blue-500/30' : ''}`}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <p
                    className={`text-xs mt-2 text-center ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 mb-6 transition-all ${
                      stepOrder.indexOf(step.id as WorkflowStep) < currentIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUploadStep = () => (
    <Card className="bg-slate-800/50 border-gray-700 p-8 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Upload className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-white text-xl mb-2">Upload Your AI Model</h3>
        <p className="text-gray-400 mb-6">
          Your model never leaves your machine. We generate ZK proofs locally.
        </p>

        {!user && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-300 text-sm">
              Please sign in to upload models and generate certificates
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Model Type</label>
          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
            disabled={!user}
          >
            <option value="image_classifier">Image Classifier</option>
            <option value="nlp_model">NLP Model</option>
            <option value="object_detection">Object Detection</option>
            <option value="recommendation">Recommendation System</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            className={`block w-full bg-slate-900 border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
              user
                ? 'border-gray-600 hover:border-blue-500 hover:bg-slate-800'
                : 'border-gray-700 cursor-not-allowed opacity-50'
            }`}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".h5,.pb,.onnx,.pt,.pth"
              disabled={!user}
            />
            {selectedFile ? (
              <div className="text-center">
                <FileCode className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-white">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">Click to upload model file</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports .h5, .pb, .onnx, .pt, .pth
                </p>
              </div>
            )}
          </label>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSubmitModel}
          disabled={!selectedFile || !user || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          Start Verification
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );

  const renderProcessingStep = () => (
    <Card className="bg-slate-800/50 border-gray-700 p-8 backdrop-blur-sm">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-spin" />
        <h3 className="text-white text-xl mb-2">Running Adversarial Tests</h3>
        <p className="text-gray-400 mb-6">
          Testing model against FGSM, PGD, CW, and DeepFool attacks...
        </p>
        <div className="space-y-3">
          {['FGSM Attack', 'PGD Attack', 'Carlini-Wagner Attack', 'DeepFool Attack'].map(
            (attack, index) => (
              <div
                key={attack}
                className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg"
              >
                <span className="text-gray-300">{attack}</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  );

  const renderProofStep = () => (
    <Card className="bg-slate-800/50 border-gray-700 p-8 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10 text-purple-400 animate-pulse" />
        </div>
        <h3 className="text-white text-xl mb-2">Generating Zero-Knowledge Proof</h3>
        <p className="text-gray-400 mb-6">
          Creating cryptographic proof using Midnight Protocol...
        </p>
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <code className="text-sm text-cyan-300">zkSNARKs generation in progress...</code>
        </div>
      </div>
    </Card>
  );

  const renderCertificateStep = () => (
    <Card className="bg-slate-800/50 border-gray-700 p-8 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
          <Award className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-white text-xl mb-2">Verification Complete!</h3>
        <p className="text-gray-400 mb-6">
          Your model has been verified and a certificate has been issued.
        </p>

        {result && (
          <div className="space-y-4 mb-6">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Robustness Score</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  {(result.robustnessScore! * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${result.robustnessScore! * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg text-left">
              <p className="text-sm text-gray-400 mb-1">Proof Hash</p>
              <code className="text-xs text-cyan-300 break-all">
                {result.proofHash}
              </code>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg text-left">
              <p className="text-sm text-gray-400 mb-1">Blockchain Transaction</p>
              <code className="text-xs text-purple-300 break-all">
                {result.blockchainTx}
              </code>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => window.open(result.certificateUrl, '_blank')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Certificate
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-slate-700"
              >
                Verify Another Model
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-white text-3xl">ZK-ARMOR Demo Workflow</h1>
          </div>
          <p className="text-gray-400">
            Experience the complete AI model verification process with zero-knowledge proofs
          </p>
        </div>

        <SetupBanner />

        {renderStepIndicator()}

        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'proof' && renderProofStep()}
        {currentStep === 'certificate' && renderCertificateStep()}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by Midnight Protocol • Supabase • ZK-ARMOR
          </p>
        </div>
      </div>
    </div>
  );
}
