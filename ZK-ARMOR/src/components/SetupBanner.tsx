import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export function SetupBanner() {
  const setupSteps = [
    {
      name: 'Supabase Connected',
      status: 'complete',
      description: 'Database and authentication ready'
    },
    {
      name: 'Backend API Running',
      status: 'complete',
      description: 'Edge functions deployed'
    },
    {
      name: 'Midnight Node Setup',
      status: 'pending',
      description: 'Run Docker container locally',
      link: '/MIDNIGHT_SETUP.md'
    },
    {
      name: 'Smart Contract Deployed',
      status: 'pending',
      description: 'Deploy Compact contract to testnet',
      link: '/MIDNIGHT_SETUP.md'
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50 p-6 backdrop-blur-sm mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white text-lg mb-1">🚀 ZK-ARMOR Setup Status</h3>
          <p className="text-sm text-gray-400">
            Backend connected! Follow the setup guide to enable Midnight Protocol integration.
          </p>
        </div>
        <a
          href="/MIDNIGHT_SETUP.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
        >
          Setup Guide
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {setupSteps.map((step) => (
          <div
            key={step.name}
            className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg"
          >
            {step.status === 'complete' ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-sm">{step.name}</span>
                <Badge
                  className={
                    step.status === 'complete'
                      ? 'bg-green-500/20 text-green-300 border-green-500/50 text-xs'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 text-xs'
                  }
                >
                  {step.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
