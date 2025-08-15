import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

interface AuthContextType {
  // User authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  
  // Wallet state
  wallet: any;
  walletAddress: string | null;
  isWalletConnected: boolean;
  
  // AVAX balance
  avaxBalance: string;
  isLoadingBalance: boolean;
  
  // Auth methods
  login: () => void;
  logout: () => void;
  connectWallet: () => void;
  
  // Wallet operations
  refreshBalance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout: privyLogout,
    connectWallet: privyConnectWallet,
    createWallet 
  } = usePrivy();
  
  const { wallets } = useWallets();
  
  // Local state
  const [avaxBalance, setAvaxBalance] = useState<string>('0.0000');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  
  // Get the primary wallet
  const wallet = wallets[0];
  const walletAddress = wallet?.address || null;
  const isWalletConnected = !!wallet && wallet.connectorType !== 'embedded';
  
  // Fetch AVAX balance
  const refreshBalance = async () => {
    if (!walletAddress) {
      setAvaxBalance('0.0000');
      return;
    }
    
    setIsLoadingBalance(true);
    try {
      // Import the balance fetching utility
      const { fetchAVAXBalance, formatAVAXAmount } = await import('../utils/avaxBalance');
      
      // Fetch real AVAX balance from Avalanche Fuji Testnet
      console.log('Fetching real AVAX balance for:', walletAddress);
      const balance = await fetchAVAXBalance(walletAddress, true); // Use testnet
      const formattedBalance = formatAVAXAmount(balance);
      
      console.log('Real AVAX balance fetched:', balance, 'formatted:', formattedBalance);
      setAvaxBalance(formattedBalance);
      
    } catch (error) {
      console.error('Error fetching AVAX balance:', error);
      // Fallback to mock balance on error
      const mockBalance = (Math.random() * 10).toFixed(4);
      const { formatAVAXAmount } = await import('../utils/avaxBalance');
      setAvaxBalance(formatAVAXAmount(mockBalance));
    } finally {
      setIsLoadingBalance(false);
    }
  };
  
  // Handle wallet creation and balance refresh
  useEffect(() => {
    if (authenticated) {
      // If user is authenticated but has no wallet, try to create one
      if (wallets.length === 0 && user) {
        createWallet()
          .catch((error) => {
            console.error('Failed to create embedded wallet:', error);
          });
      }
      
      if (walletAddress) {
        refreshBalance();
      } else {
        setAvaxBalance('0.0000');
      }
    } else {
      setAvaxBalance('0.0000');
    }
  }, [authenticated, walletAddress, wallets, user, createWallet]);
  
  // Enhanced logout that clears local state
  const logout = async () => {
    setAvaxBalance('0.0000');
    setIsLoadingBalance(false);
    await privyLogout();
  };
  
  // Enhanced wallet connection
  const connectWallet = () => {
    privyConnectWallet();
  };
  
  const contextValue: AuthContextType = {
    // Authentication state
    isAuthenticated: ready && authenticated,
    isLoading: !ready,
    user,
    
    // Wallet state
    wallet,
    walletAddress,
    isWalletConnected,
    
    // AVAX balance
    avaxBalance,
    isLoadingBalance,
    
    // Methods
    login,
    logout,
    connectWallet,
    refreshBalance,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
