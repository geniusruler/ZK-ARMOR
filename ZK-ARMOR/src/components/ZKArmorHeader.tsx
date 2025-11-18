import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Shield, LogOut, User } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { authHelpers } from '../utils/supabase-client';

interface ZKArmorHeaderProps {
  onNavigateToDocs?: () => void;
  onNavigateToDemo?: () => void;
}

export function ZKArmorHeader({ onNavigateToDocs, onNavigateToDemo }: ZKArmorHeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const session = await authHelpers.getSession();
        if (session) {
          const userData = await authHelpers.getUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = authHelpers.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await authHelpers.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <>
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-circuit-pattern opacity-20"></div>
                </div>
              </div>
              <span className="text-xl text-white">ZK-<span className="text-blue-400">ARMOR</span></span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm">
                Features
              </a>
              <button 
                onClick={onNavigateToDemo}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Demo
              </button>
              <button 
                onClick={onNavigateToDocs}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Docs
              </button>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm">
                About
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
