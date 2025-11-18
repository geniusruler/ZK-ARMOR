import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card } from './ui/card';

export function CTASection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden border-gray-700/50 bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm max-w-5xl mx-auto">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative p-12 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm text-blue-200">Limited Time: First 100 Certifications Free</span>
            </div>

            <h2 className="mb-6 text-white max-w-3xl mx-auto">
              Ready to Prove Your AI is Secure?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join leading AI companies using ZK-ARMOR to demonstrate cryptographically verified robustness
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 group"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8"
              >
                Schedule Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                ✓ No credit card required
              </div>
              <div className="flex items-center gap-2">
                ✓ 14-day free trial
              </div>
              <div className="flex items-center gap-2">
                ✓ Cancel anytime
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
