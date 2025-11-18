import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';

export function ZKArmorFooter() {
  return (
    <footer className="relative bg-slate-950 border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-white">ZK-ARMOR</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Cryptographically verifiable AI robustness for enterprise security
            </p>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 p-2">
                <Github className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 p-2">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 p-2">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#integrations" className="text-gray-400 hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#api" className="text-gray-400 hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#docs" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#guides" className="text-gray-400 hover:text-white transition-colors">
                  Guides
                </a>
              </li>
              <li>
                <a href="#blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#support" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#security" className="text-gray-400 hover:text-white transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Target Audience */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-center text-gray-400 text-sm mb-4">
            Built for: <span className="text-white">AI Developers</span> | <span className="text-white">Healthcare Providers</span> | <span className="text-white">Research Labs</span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            © 2025 ZK-ARMOR. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#privacy" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>
    </footer>
  );
}
