import { Button } from './ui/button';
import { Play, ArrowRight, Sparkles } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Particle Animation */}
      <ParticleBackground />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300">Powered by Midnight Protocol</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="mb-6 text-white max-w-5xl mx-auto">
          Cryptographically Verifiable AI Robustness
        </h1>
        
        {/* Subheading */}
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Prove your AI models are attack-resistant without revealing proprietary architectures. 
          Zero-knowledge certification for enterprise AI security.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 group"
          >
            Get Certified
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white px-8"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Demo
          </Button>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>NIST AI 100-2 Aligned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>HITRUST Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </section>
  );
}
