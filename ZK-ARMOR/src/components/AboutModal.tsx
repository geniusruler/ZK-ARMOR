import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import { Shield, Lock, Dna, Database, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-900">
            About MidnightHelix
          </DialogTitle>
          <DialogDescription>
            Privacy-first AI for personalized medicine powered by Midnight Protocol and AlphaFold 3
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
            <h3 className="mb-3 text-blue-900">What is MidnightHelix?</h3>
            <p className="text-gray-700 mb-3">
              MidnightHelix combines cutting-edge AI protein structure prediction with military-grade privacy 
              to enable healthcare professionals and researchers to analyze sensitive genetic data securely.
            </p>
            <p className="text-gray-700">
              Built on Midnight Protocol's zero-knowledge infrastructure, we ensure that patient data remains 
              private while still delivering powerful AI-driven insights for personalized medicine.
            </p>
          </Card>

          {/* How It Works */}
          <div>
            <h3 className="mb-4 text-blue-900">How It Works</h3>
            <div className="space-y-3">
              <Card className="p-4 border-l-4 border-l-blue-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-900">1</span>
                  </div>
                  <div>
                    <h4 className="text-blue-900 mb-1">Secure Data Upload</h4>
                    <p className="text-sm text-gray-700">
                      Upload genetic data files (FASTA, VCF, etc.). Data is immediately encrypted using AES-256 
                      encryption at the source—never leaving your control in plaintext.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              <Card className="p-4 border-l-4 border-l-green-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-900">2</span>
                  </div>
                  <div>
                    <h4 className="text-green-900 mb-1">Privacy-Preserving Computation</h4>
                    <p className="text-sm text-gray-700">
                      AlphaFold 3 runs on your encrypted data using secure multi-party computation. The AI model 
                      never sees your raw data—only encrypted representations.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              <Card className="p-4 border-l-4 border-l-purple-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-900">3</span>
                  </div>
                  <div>
                    <h4 className="text-purple-900 mb-1">Zero-Knowledge Compliance Proof</h4>
                    <p className="text-sm text-gray-700">
                      Midnight Protocol generates a cryptographic proof that the analysis followed HIPAA/GDPR 
                      standards—without revealing any patient data or computation details.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              <Card className="p-4 border-l-4 border-l-orange-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-900">4</span>
                  </div>
                  <div>
                    <h4 className="text-orange-900 mb-1">Secure Results & Collaboration</h4>
                    <p className="text-sm text-gray-700">
                      Receive encrypted results with verified compliance proofs. Share securely with other 
                      providers or integrate into your clinical workflow—all with full audit trails.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Key Technologies */}
          <div>
            <h3 className="mb-4 text-blue-900">Key Technologies</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h4 className="text-blue-900">Midnight Protocol</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Privacy-preserving blockchain infrastructure that enables zero-knowledge proofs and 
                  confidential smart contracts for healthcare compliance.
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Dna className="w-6 h-6 text-green-600" />
                  <h4 className="text-green-900">AlphaFold 3</h4>
                </div>
                <p className="text-sm text-gray-700">
                  State-of-the-art AI model for protein structure prediction, delivering research-grade 
                  accuracy for clinical decision support.
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-6 h-6 text-purple-600" />
                  <h4 className="text-purple-900">AES-256 Encryption</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Military-grade encryption applied at the source ensures patient data is protected 
                  throughout the entire analysis pipeline.
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-6 h-6 text-orange-600" />
                  <h4 className="text-orange-900">Secure Computation</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Multi-party computation techniques allow AI analysis on encrypted data without ever 
                  decrypting sensitive patient information.
                </p>
              </Card>
            </div>
          </div>

          {/* Compliance */}
          <div>
            <h3 className="mb-4 text-blue-900">Compliance & Security</h3>
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-900">HIPAA Compliance</span>
                    <p className="text-sm text-green-700 mt-1">
                      Adheres to Health Insurance Portability and Accountability Act requirements for 
                      protecting patient health information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-900">GDPR Certified</span>
                    <p className="text-sm text-green-700 mt-1">
                      Complies with General Data Protection Regulation Article 32 for data security and 
                      privacy by design.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-900">21 CFR Part 11</span>
                    <p className="text-sm text-green-700 mt-1">
                      Electronic records and signatures comply with FDA regulations for clinical applications.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-900">SOC 2 Type II</span>
                    <p className="text-sm text-green-700 mt-1">
                      Independently audited security controls for protecting customer data.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="p-4 bg-orange-50 border-orange-200">
            <h4 className="text-orange-900 mb-2">Important Notice</h4>
            <p className="text-sm text-orange-800">
              MidnightHelix is designed for research and clinical decision support. This platform is not 
              intended for collecting personally identifiable information (PII) or storing sensitive data 
              long-term. All results should be validated through appropriate clinical and experimental methods.
            </p>
          </Card>

          {/* Use Cases */}
          <div>
            <h3 className="mb-4 text-blue-900">Use Cases</h3>
            <div className="grid gap-3">
              <Card className="p-4">
                <h4 className="text-gray-900 mb-1">Personalized Cancer Treatment</h4>
                <p className="text-sm text-gray-600">
                  Predict protein-drug interactions for targeted therapy selection based on patient genetic profiles.
                </p>
              </Card>
              <Card className="p-4">
                <h4 className="text-gray-900 mb-1">Rare Disease Research</h4>
                <p className="text-sm text-gray-600">
                  Analyze novel protein mutations and their structural impacts for rare genetic disorders.
                </p>
              </Card>
              <Card className="p-4">
                <h4 className="text-gray-900 mb-1">Drug Discovery</h4>
                <p className="text-sm text-gray-600">
                  Accelerate pharmaceutical research with privacy-preserving protein-ligand binding predictions.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
