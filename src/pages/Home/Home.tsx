import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigateWithLoading } from '../../hooks/useNavigateWithLoading';
import { Cog6ToothIcon, ArrowDownIcon, ArrowUpIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Modal } from '../../components/Modal';
import { TransactionDetailsModal, type TransactionDetails } from '../../components/TransactionDetailsModal';
import { useAuth } from '../../contexts/AuthContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
    },
  },
};

const balanceVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 200,
      delay: 0.2,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
    },
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 400,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const transactionItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 400,
    },
  },
};

export const Home = () => {
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const navigate = useNavigate();
  const navigateWithLoading = useNavigateWithLoading();
  const location = useLocation();
  
  // Authentication context
  const { 
    isAuthenticated, 
    user, 
    walletAddress, 
    usdcBalance, 
    isLoadingBalance, 
    logout, 
    refreshBalance 
  } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Debug: Log user data to see what Privy provides
  useEffect(() => {
    if (user) {
      console.log('Privy user object:', user);
      console.log('User email:', user.email);
      console.log('User wallet:', user.wallet);
      console.log('User linkedAccounts:', user.linkedAccounts);
    }
  }, [user]);

  // Sync panic mode from Settings page
  useEffect(() => {
    if (location.state?.panicMode !== undefined) {
      setIsPanicMode(location.state.panicMode);
    }
  }, [location.state]);

  const handleReceive = () => {
    if (!isPanicMode) {
      navigateWithLoading('/receive', {
        loadingMessage: "Opening receive options...",
        delay: 300
      });
    } else {
      setShowErrorModal(true);
    }
  };

  const handleWithdraw = () => {
    if (!isPanicMode) {
      navigateWithLoading('/withdraw', {
        loadingMessage: "Opening withdraw flow...",
        delay: 300
      });
    } else {
      setShowErrorModal(true);
    }
  };

  const handleTransactions = () => {
    navigateWithLoading('/transactions', {
      loadingMessage: "Loading transaction history...",
      delay: 250
    });
  };

  const handleSettings = () => {
    navigateWithLoading('/settings', {
      state: { panicMode: isPanicMode },
      loadingMessage: "Opening settings...",
      delay: 300
    });
  };

  const handleTransactionClick = (tx: Tx) => {
    // Convert Tx to TransactionDetails format
    const transactionDetails: TransactionDetails = {
      id: tx.id,
      type: tx.direction === 'credit' ? 'received' : 'sent',
      counterparty: tx.counterparty,
      amount: tx.amount,
      date: new Date().toISOString(), // Mock date
      status: tx.status,
      narration: tx.label,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
      fee: '0.001 USDC',
      network: 'Ethereum',
      confirmations: tx.status === 'completed' ? 12 : tx.status === 'pending' ? 3 : 0,
      timestamp: new Date().toISOString(),
    };
    
    setSelectedTransaction(transactionDetails);
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
  };

  type Tx = {
    id: string;
    direction: 'credit' | 'debit';
    counterparty: string;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    label: string;
  };

  const recentTransactions: Tx[] = [
    { id: '1', direction: 'credit', counterparty: 'Alice', amount: '+50 USDC', status: 'completed', label: 'Received' },
    { id: '2', direction: 'debit', counterparty: 'Bob', amount: '-20 USDC', status: 'pending', label: 'Sent' },
  ];

  const computeClasses = (status: Tx['status'], direction: Tx['direction']) => {
    // Pending always yellow
    if (status === 'pending') {
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
        dot: 'bg-yellow-400',
        amount: 'text-yellow-400',
        stripe: 'border-l-yellow-500',
      };
    }

    // Failed always red
    if (status === 'failed') {
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        dot: 'bg-red-400',
        amount: 'text-red-400',
        stripe: 'border-l-red-500',
      };
    }

    // Completed: green for credit, red for debit
    if (direction === 'credit') {
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/20',
        dot: 'bg-green-400',
        amount: 'text-green-400',
        stripe: 'border-l-green-500',
      };
    }

    return {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      dot: 'bg-red-400',
      amount: 'text-red-400',
      stripe: 'border-l-red-500',
    };
  };

  return (
    <>
      {/* Mobile Restriction Warning */}
      <div className="app-route">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mobile Only</h2>
          <p className="text-lg mb-6">This app is designed for mobile devices only.</p>
          <p className="text-sm text-text-secondary">Please open this app on your mobile device for the best experience.</p>
        </div>
      </div>

      {/* App Content */}
      <motion.div
        className="app-content min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="px-6 py-8">
          <motion.div
            className="flex items-center justify-between mb-8"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-lg font-medium text-text-primary">
                Hi, {(() => {
                  // Try to get email from direct property
                  if (user?.email && typeof user.email === 'string') {
                    return user.email.split('@')[0];
                  }
                  
                  // Try to get email from linkedAccounts (common in Privy)
                  const emailAccount = user?.linkedAccounts?.find(
                    (account: any) => account.type === 'email'
                  );
                  if (emailAccount?.address && typeof emailAccount.address === 'string') {
                    return emailAccount.address.split('@')[0];
                  }
                  
                  // Try to get name from user object
                  if (user?.name && typeof user.name === 'string') {
                    return user.name;
                  }
                  
                  // Fallback to wallet address
                  if (user?.wallet?.address && typeof user.wallet.address === 'string') {
                    return user.wallet.address.slice(0, 6);
                  }
                  
                  // Fallback to context wallet address
                  if (walletAddress) {
                    return walletAddress.slice(0, 6);
                  }
                  
                  return 'User';
                })()}
              </h1>
              {walletAddress && (
                <p className="text-xs text-text-secondary mt-1">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <motion.button 
                onClick={logout}
                className="w-12 h-12 bg-surface border border-border rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover:border-border/60 hover:bg-red-500/10 hover:border-red-500/20"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6 text-text-primary hover:text-red-400" />
              </motion.button>
              <motion.button 
                onClick={handleSettings}
                className="w-12 h-12 bg-surface border border-border rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover:border-border/60"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Cog6ToothIcon className="w-6 h-6 text-text-primary" />
              </motion.button>
            </div>
          </motion.div>

          {/* Panic Mode Banner */}
          {isPanicMode && (
            <motion.div
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">
                  Panic Mode Active – Disable in Settings to resume activity.
                </span>
              </div>
            </motion.div>
          )}

          {/* Balance Display */}
          <motion.div
            className="text-center mb-8"
            variants={balanceVariants}
          >
            <div className="mb-2">
              <span className="text-sm text-text-secondary">Available Balance</span>
            </div>
            <div className="text-4xl font-bold text-text-primary mb-1">
              {isPanicMode ? 'Insufficient funds' : (
                isLoadingBalance ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  `${usdcBalance} USDC`
                )
              )}
            </div>
            {!isPanicMode && walletAddress && (
              <motion.button
                onClick={refreshBalance}
                className="text-xs text-text-secondary hover:text-primary transition-colors mt-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Refresh Balance
              </motion.button>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            variants={containerVariants}
          >
            <motion.button
              onClick={handleReceive}
              disabled={isPanicMode}
              className={`p-6 rounded-xl transition-all duration-300 ${
                isPanicMode
                  ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-surface border border-border text-text-primary shadow-sm hover:shadow-md'
              }`}
              variants={buttonVariants}
              whileHover={!isPanicMode ? "hover" : undefined}
              whileTap={!isPanicMode ? "tap" : undefined}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isPanicMode ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}>
                  <ArrowDownIcon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Receive</span>
              </div>
            </motion.button>

            <motion.button
              onClick={handleWithdraw}
              disabled={isPanicMode}
              className={`p-6 rounded-xl transition-all duration-300 ${
                isPanicMode
                  ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-surface border border-border text-text-primary shadow-sm hover:shadow-md'
              }`}
              variants={buttonVariants}
              whileHover={!isPanicMode ? "hover" : undefined}
              whileTap={!isPanicMode ? "tap" : undefined}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isPanicMode ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}>
                  <ArrowUpIcon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Withdraw</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            className="bg-surface border border-border/20 rounded-xl p-6 shadow-sm"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-between mb-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-text-primary">Recent Transactions</h2>
              <motion.button 
                onClick={handleTransactions}
                className="text-text-primary text-sm font-medium hover:text-text-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </motion.div>
            
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={containerVariants}
            >
              {recentTransactions.map((tx, index) => {
                const c = computeClasses(tx.status, tx.direction);
                return (
                  <motion.div
                    key={tx.id}
                    className={`flex items-center justify-between p-4 bg-surface-secondary border ${c.border} rounded-xl hover:border-border/40 transition-all duration-300 ${c.stripe} border-l-4 cursor-pointer`}
                    variants={transactionItemVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    custom={index}
                    onClick={() => handleTransactionClick(tx)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
                        {tx.direction === 'credit' ? (
                          <ArrowDownIcon className={`w-5 h-5 ${c.amount}`} />
                        ) : (
                          <ArrowUpIcon className={`w-5 h-5 ${c.amount}`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {tx.direction === 'credit' ? 'From' : 'To'}: {tx.counterparty}
                        </div>
                        <div className={`text-xs inline-flex items-center gap-2 px-2 py-0.5 border rounded-full ${c.bg} ${c.text} ${c.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                          <span className="capitalize">{tx.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${c.amount}`}>{tx.amount}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="success"
          title="Action Successful!"
          message="Your request has been processed successfully."
          actionText="Continue"
          onAction={() => setShowSuccessModal(false)}
        />

        {/* Error Modal */}
        <Modal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          type="error"
          title="Action Blocked"
          message="This action is not available while Panic Mode is active. Please disable Panic Mode in Settings to continue."
          actionText="Go to Settings"
          onAction={() => {
            setShowErrorModal(false);
            navigate('/settings');
          }}
        />

        {/* Transaction Details Modal */}
        <TransactionDetailsModal
          isOpen={isTransactionModalOpen}
          onClose={closeTransactionModal}
          transaction={selectedTransaction}
        />
      </motion.div>
    </>
  );
};
