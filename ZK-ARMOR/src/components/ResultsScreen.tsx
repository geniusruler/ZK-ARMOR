import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Shield, 
  Download, 
  Share2, 
  CheckCircle2, 
  Lock, 
  FileText,
  ExternalLink,
  Copy,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import type { AnalysisData } from './PredictionRequest';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ResultsScreenProps {
  analysisData: AnalysisData;
  fileName: string;
  onNewAnalysis: () => void;
}

export function ResultsScreen({ analysisData, fileName, onNewAnalysis }: ResultsScreenProps) {
  const [showProofModal, setShowProofModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://midnighthelix.app/share/abc123xyz');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock transaction hashes for audit trail
  const auditTrail = [
    { id: 1, action: 'Data Upload', hash: '0x7a8f9c2...b4d1e6', timestamp: 'Nov 12, 2025 10:23 AM', status: 'verified' },
    { id: 2, action: 'Encryption Applied', hash: '0x3e5d7f1...c8a2b9', timestamp: 'Nov 12, 2025 10:23 AM', status: 'verified' },
    { id: 3, action: 'Analysis Started', hash: '0x9b2c4e6...f1d3a8', timestamp: 'Nov 12, 2025 10:24 AM', status: 'verified' },
    { id: 4, action: 'Prediction Complete', hash: '0x4f8a1c9...e7b2d5', timestamp: 'Nov 12, 2025 10:27 AM', status: 'verified' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-blue-900">Analysis Results</h2>
            <p className="text-gray-600">
              AlphaFold 3 prediction for {analysisData.targetProtein}
            </p>
          </div>
          <Button onClick={onNewAnalysis} variant="outline">
            New Analysis
          </Button>
        </div>

        {/* Validation Banner */}
        <Alert className="mb-6 border-green-300 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="text-green-900">Result Validated & Compliant</span>
              <span className="block text-sm text-green-700 mt-1">
                Zero-knowledge proof generated • HIPAA/GDPR standards verified
              </span>
            </div>
            <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-green-400 text-green-700 hover:bg-green-100">
                  <Shield className="w-4 h-4 mr-2" />
                  View Proof
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Zero-Knowledge Compliance Proof
                  </DialogTitle>
                  <DialogDescription>
                    Cryptographic verification that this analysis followed HIPAA/GDPR standards without exposing raw data
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">Proof Verified</span>
                    </div>
                    <p className="text-sm text-green-700">
                      This analysis has been cryptographically proven to comply with all relevant healthcare data regulations.
                    </p>
                  </Card>

                  <div className="space-y-2">
                    <Label>Proof Hash</Label>
                    <div className="bg-gray-100 p-3 rounded font-mono text-xs break-all">
                      0xzkp_proof_9a7f2c8e4d1b3f6a8c2e5d7f9b1a4c6e8d2f5a7b9c1e3d6f8a2c5e7d9f1b3a4c
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Compliance Standards</Label>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>HIPAA</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>GDPR Article 32</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>21 CFR Part 11</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Verification Details</Label>
                      <div className="mt-2 space-y-1 text-sm text-gray-700">
                        <p>Timestamp: Nov 12, 2025 10:27:43 AM</p>
                        <p>Validator: Midnight Protocol</p>
                        <p>Block: 1,234,567</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Verify on Blockchain Explorer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Protein Structure Visualization */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="mb-4 text-blue-900">Predicted Protein Structure</h3>
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg aspect-[16/10] flex items-center justify-center relative overflow-hidden">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1743338960176-02107775b73d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwbW9sZWN1bGUlMjAzRHxlbnwxfHx8fDE3NjI5ODA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="3D Protein Structure"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-white text-xs">Powered by AlphaFold 3</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Interactive 3D visualization of the predicted {analysisData.targetProtein} protein structure based on your genetic data.
            </p>
          </Card>

          {/* Key Metrics */}
          <Card className="p-6">
            <h3 className="mb-4 text-blue-900">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Structural Confidence</span>
                  <span className="text-sm text-blue-900">94.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.7%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Binding Affinity</span>
                  <span className="text-sm text-green-900">8.2 nM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Model Accuracy</span>
                  <span className="text-sm text-purple-900">91.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91.3%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-xs text-gray-600 mb-3 block">Predicted Properties</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Molecular Weight</span>
                    <span className="text-gray-900">45.2 kDa</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Residues</span>
                    <span className="text-gray-900">412</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Active Sites</span>
                    <span className="text-gray-900">3</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="summary" className="mb-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="compliance">Compliance & Privacy</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <Card className="p-6">
              <h3 className="mb-4 text-blue-900">Analysis Summary</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Patient ID</Label>
                  <p className="text-gray-900">{analysisData.patientId}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Target Protein</Label>
                  <p className="text-gray-900">{analysisData.targetProtein}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Analysis Type</Label>
                  <Badge variant="outline" className="mt-1">
                    {analysisData.analysisType === 'structure' ? 'Protein Structure Prediction' : analysisData.analysisType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Source File</Label>
                  <p className="text-gray-900 text-sm">{fileName}</p>
                </div>
                {analysisData.notes && (
                  <div>
                    <Label className="text-sm text-gray-600">Clinical Notes</Label>
                    <p className="text-gray-700 text-sm mt-1">{analysisData.notes}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <Label className="text-sm text-gray-600 mb-2 block">Key Findings</Label>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>High confidence structural prediction with 94.7% accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Strong binding affinity identified (8.2 nM)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Three active sites detected with potential therapeutic targets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>Recommended follow-up: validation with experimental methods</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="mt-4">
            <Card className="p-6">
              <h3 className="mb-4 text-blue-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Privacy & Compliance Verification
              </h3>
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    All privacy and compliance requirements have been verified through zero-knowledge proofs
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      <span>Data Encryption</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      AES-256 encryption applied at source. Data never transmitted or stored in plaintext.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>HIPAA Compliance</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      All processing adheres to HIPAA security and privacy rules.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span>GDPR Certified</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Data processing complies with GDPR Article 32 requirements.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <span>Audit Ready</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Complete cryptographic audit trail maintained for compliance verification.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowProofModal(true)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    View Full Compliance Proof
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <Card className="p-6">
              <h3 className="mb-4 text-blue-900">Encrypted Audit Trail</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete transaction history with cryptographic verification
              </p>
              <div className="space-y-3">
                {auditTrail.map((entry) => (
                  <div key={entry.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-900">{entry.action}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 font-mono mb-1">
                      Hash: {entry.hash}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <Card className="p-6">
          <h3 className="mb-4 text-blue-900">Secure Collaboration & Download</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-5 h-5" />
                <span>Download Encrypted Results</span>
              </div>
              <span className="text-xs text-gray-600">
                Export results in encrypted format for secure storage
              </span>
            </Button>

            <Button variant="outline" className="h-auto py-4 flex-col items-start" onClick={handleCopyLink}>
              <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-5 h-5" />
                <span>{copied ? 'Link Copied!' : 'Share with Provider'}</span>
              </div>
              <span className="text-xs text-gray-600">
                Generate secure share link with access controls
              </span>
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 mb-1">Clinical Workflow Integration</p>
                <p className="text-blue-700 text-xs mb-2">
                  Ready to integrate these results into your EHR system or clinical decision support tools.
                </p>
                <Button size="sm" variant="outline" className="border-blue-400 text-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Integration Guide
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Label({ className = '', children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`block ${className}`} {...props}>
      {children}
    </label>
  );
}
