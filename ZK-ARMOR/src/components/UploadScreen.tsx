import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, FileText, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface UploadScreenProps {
  onNext: (fileName: string) => void;
  onBack: () => void;
}

export function UploadScreen({ onNext, onBack }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setIsEncrypting(true);
    // Simulate encryption process
    setTimeout(() => {
      setUploadedFile(file.name);
      setIsEncrypting(false);
    }, 1500);
  };

  const handleContinue = () => {
    if (uploadedFile) {
      onNext(uploadedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back
          </Button>
          <h2 className="mb-2 text-blue-900">Upload Patient Genetic Data</h2>
          <p className="text-gray-600">
            Upload FASTA, VCF, or other genetic data files for secure analysis
          </p>
        </div>

        {/* Privacy Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <span>Your data is encrypted at source—never stored or shared in plaintext.</span>
            <span className="block text-sm text-blue-700 mt-1">
              All processing happens in a secure, privacy-preserving environment.
            </span>
          </AlertDescription>
        </Alert>

        {/* Upload Area */}
        <Card className="p-8 mb-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-all
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
              ${uploadedFile ? 'border-green-500 bg-green-50' : ''}
            `}
          >
            {isEncrypting ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-900 mb-2">Encrypting file...</p>
                <p className="text-sm text-gray-600">Applying end-to-end encryption</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                <p className="text-green-900 mb-2">File encrypted successfully!</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-lg">
                  <FileText className="w-4 h-4" />
                  {uploadedFile}
                </div>
                <p className="text-xs text-gray-600 mt-2">✓ Encrypted • ✓ HIPAA Compliant</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-900 mb-2">Drag and drop your genetic data file here</p>
                <p className="text-sm text-gray-600 mb-4">or</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".fasta,.vcf,.fa,.fastq,.txt"
                    onChange={handleFileSelect}
                  />
                  <Button type="button" variant="outline">
                    Browse Files
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: FASTA, VCF, FASTQ
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Security Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <Lock className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-900">AES-256 Encryption</p>
              <p className="text-xs text-gray-600">Military-grade security</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <Shield className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="text-sm text-gray-900">Zero-Knowledge</p>
              <p className="text-xs text-gray-600">Data never leaves your control</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <AlertCircle className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <p className="text-sm text-gray-900">Audit Trail</p>
              <p className="text-xs text-gray-600">Full compliance logging</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!uploadedFile}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            Continue to Analysis Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
