import { Card } from './ui/card';
import { Lock, TrendingUp, Zap, Trophy, Globe, FileText } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Zero-Knowledge Privacy',
    description: 'Model weights stay private',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'NIST AI 100-2 Aligned',
    description: 'Standards-compliant testing',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Instant Verification',
    description: 'On-chain proof validation',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Trophy,
    title: 'HITRUST Ready Architecture',
    description: 'Healthcare compliance built-in',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Globe,
    title: 'Blockchain Certified',
    description: 'Immutable certificates',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: FileText,
    title: 'Immutable Audit Trail',
    description: 'Permanent compliance records',
    gradient: 'from-rose-500 to-red-500',
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="mb-4 text-white">
            Enterprise-Grade AI Security
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for organizations that need cryptographic proof of AI model robustness
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative group overflow-hidden border-gray-700/50 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 hover:border-blue-500/50"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 blur-xl`}></div>
              </div>

              {/* Card Content */}
              <div className="relative p-6">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>

                {/* Border Glow */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl text-white mb-2">99.9%</div>
            <div className="text-gray-400 text-sm">Attack Detection Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-white mb-2">&lt;100ms</div>
            <div className="text-gray-400 text-sm">Verification Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-white mb-2">100%</div>
            <div className="text-gray-400 text-sm">Privacy Guaranteed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
