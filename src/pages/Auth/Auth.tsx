import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-surface/10 rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-surface/10 rounded-full opacity-30 blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-surface/5 rounded-full opacity-20 blur-3xl animate-pulse-glow"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* App Logo */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-surface border border-border rounded-xl flex items-center justify-center mb-4 shadow-sm mx-auto">
            <span className="text-3xl font-bold text-text-primary">A</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            AuraPay
          </h1>
        </div>

        {/* Sign In Card */}
        <div className="bg-surface border border-border/20 rounded-xl p-8 shadow-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-text-secondary">Initializing...</span>
            </div>
          ) : (
            <>
              {/* Sign In Button */}
              <button
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:scale-105 mb-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z"/>
                </svg>
                Connect Wallet
              </button>
              
              <div className="text-center text-text-secondary text-sm">
                Connect with MetaMask, WalletConnect, or create a new wallet
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
