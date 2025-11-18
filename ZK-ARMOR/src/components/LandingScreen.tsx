import { Button } from './ui/button';
import { Card } from './ui/card';
import { Shield, Lock, Dna, Microscope } from 'lucide-react';

interface LandingScreenProps {
  onGetStarted: () => void;
  onOpenAbout: () => void;
}

export function LandingScreen({ onGetStarted, onOpenAbout }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-900">Midnight<span className="text-blue-600">Helix</span></h1>
              <p className="text-xs text-gray-600">Powered by Midnight Protocol</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onOpenAbout}>
            About & Help
          </Button>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
              Privacy-First AI for Personalized Medicine
            </span>
          </div>
          <h2 className="mb-6 text-blue-900">
            Secure, Compliant, and Trustworthy Protein Analysis
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Leverage AlphaFold 3 AI to analyze genetic data and predict protein structures with zero-knowledge privacy guarantees. Your data stays encrypted—always.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Start Secure Analysis
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          <Card className="p-6 text-center border-blue-200 hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-blue-900">End-to-End Encryption</h3>
            <p className="text-sm text-gray-600">
              Data encrypted at source, never stored in plaintext
            </p>
          </Card>

          <Card className="p-6 text-center border-green-200 hover:border-green-400 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Microscope className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-green-900">AlphaFold 3 AI</h3>
            <p className="text-sm text-gray-600">
              State-of-the-art protein structure prediction
            </p>
          </Card>

          <Card className="p-6 text-center border-purple-200 hover:border-purple-400 transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="mb-2 text-purple-900">Zero-Knowledge Proof</h3>
            <p className="text-sm text-gray-600">
              HIPAA/GDPR compliance without exposing data
            </p>
          </Card>

          <Card className="p-6 text-center border-blue-200 hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dna className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-blue-900">Personalized Medicine</h3>
            <p className="text-sm text-gray-600">
              Tailored insights for better patient outcomes
            </p>
          </Card>
        </div>

        {/* Trust Section */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            Trusted by healthcare professionals and researchers worldwide
          </p>
          <div className="flex justify-center items-center gap-8 mt-6 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">GDPR Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm">SOC 2 Type II</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
