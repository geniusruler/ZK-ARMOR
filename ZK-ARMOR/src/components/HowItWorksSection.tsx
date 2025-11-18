import { Card } from './ui/card';
import { Upload, Cpu, Shield, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Model',
    description: 'Submit your AI model for adversarial testing. Your model architecture and weights remain encrypted.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'Run Attack Suite',
    description: 'Our zero-knowledge testing framework runs NIST-aligned adversarial attacks without accessing your model.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    number: '03',
    title: 'Generate ZK Proof',
    description: 'Cryptographic proof generated on Midnight Protocol proving robustness without revealing test details.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Receive Certificate',
    description: 'Get blockchain-certified, immutable proof of AI robustness ready for compliance and audits.',
    color: 'from-orange-500 to-red-500',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="text-sm text-blue-400">How It Works</span>
          </div>
          <h2 className="mb-4 text-white">
            Four Steps to Certified AI Security
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get cryptographically verified proof of your model's robustness in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-700 to-transparent -ml-3"></div>
              )}

              <Card className="relative border-gray-700/50 bg-slate-800/40 backdrop-blur-sm p-6 h-full hover:bg-slate-800/60 transition-all duration-300 group">
                {/* Number Badge */}
                <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-sm`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} p-0.5 mb-4`}>
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500 mb-6">Powered by</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="px-6 py-3 rounded-lg bg-slate-800/40 border border-gray-700/50 backdrop-blur-sm">
              <span className="text-gray-300">Midnight Protocol</span>
            </div>
            <div className="px-6 py-3 rounded-lg bg-slate-800/40 border border-gray-700/50 backdrop-blur-sm">
              <span className="text-gray-300">NIST AI 100-2</span>
            </div>
            <div className="px-6 py-3 rounded-lg bg-slate-800/40 border border-gray-700/50 backdrop-blur-sm">
              <span className="text-gray-300">Zero-Knowledge Proofs</span>
            </div>
            <div className="px-6 py-3 rounded-lg bg-slate-800/40 border border-gray-700/50 backdrop-blur-sm">
              <span className="text-gray-300">HITRUST CSF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
