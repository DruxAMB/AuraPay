import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigateWithLoading } from '../../hooks/useNavigateWithLoading';
import { ArrowLeftIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { TransactionDetailsModal, type TransactionDetails } from '../../components/TransactionDetailsModal';
import { useAuth } from '../../contexts/AuthContext';

type Transaction = {
  id: string;
  type: 'sent' | 'received';
  counterparty: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  narration?: string;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
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

// Generate mock transactions with real wallet address
const generateMockTransactions = (walletAddress: string): Transaction[] => [
  {
    id: '1',
    type: 'received',
    counterparty: 'Alice Smith',
    amount: '+150.00',
    date: '2024-01-15',
    status: 'completed',
    narration: 'Payment for services',
  },
  {
    id: '2',
    type: 'sent',
    counterparty: 'Bob Johnson',
    amount: '-75.50',
    date: '2024-01-14',
    status: 'completed',
    narration: 'Dinner payment',
  },
  {
    id: '3',
    type: 'received',
    counterparty: `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`,
    amount: '+500.00',
    date: '2024-01-13',
    status: 'completed',
    narration: 'Direct wallet transfer',
  },
  {
    id: '4',
    type: 'sent',
    counterparty: 'Carol Wilson',
    amount: '-200.00',
    date: '2024-01-12',
    status: 'pending',
    narration: 'Rent payment',
  },
  {
    id: '5',
    type: 'sent',
    counterparty: `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`,
    amount: '-50.00',
    date: '2024-01-11',
    status: 'failed',
    narration: 'Failed transaction attempt',
  },
];

export const Transactions = () => {
  const navigate = useNavigate();
  const navigateWithLoading = useNavigateWithLoading();
  const { isAuthenticated, walletAddress } = useAuth();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Generate transactions with real wallet address
  useEffect(() => {
    if (walletAddress) {
      const mockTransactions = generateMockTransactions(walletAddress);
      setTransactions(mockTransactions);
    }
  }, [walletAddress]);

  const handleTransactionClick = (transaction: Transaction) => {
    // Convert Transaction to TransactionDetails format
    const transactionDetails: TransactionDetails = {
      ...transaction,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
      fee: '0.001 USDC',
      network: 'Ethereum',
      confirmations: transaction.status === 'completed' ? 12 : transaction.status === 'pending' ? 3 : 0,
      timestamp: new Date(transaction.date).toISOString(),
    };
    
    setSelectedTransaction(transactionDetails);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const computeClasses = (status: Transaction['status'], type: Transaction['type']) => {
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

    // Completed: green for received, red for sent
    if (type === 'received') {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-border/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.button 
          onClick={() => navigateWithLoading('/home', {
            loadingMessage: "Returning to home...",
            delay: 250
          })} 
          className="p-2 hover:bg-surface rounded-xl transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </motion.button>
        <h1 className="text-lg font-semibold text-text-primary">Transactions</h1>
        <div className="w-10" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {transactions.map((transaction: Transaction, index: number) => {
            const c = computeClasses(transaction.status, transaction.type);
            return (
              <motion.div
                key={transaction.id}
                className={`flex items-center justify-between p-4 bg-surface-secondary border ${c.border} rounded-xl hover:border-border/40 transition-all duration-300 ${c.stripe} border-l-4 cursor-pointer`}
                variants={transactionItemVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                custom={index}
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
                    {transaction.type === 'received' ? (
                      <ArrowDownIcon className={`w-5 h-5 ${c.amount}`} />
                    ) : (
                      <ArrowUpIcon className={`w-5 h-5 ${c.amount}`} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-text-primary mb-1">
                      {transaction.type === 'received' ? 'From' : 'To'}: {transaction.counterparty}
                    </div>
                    {transaction.narration && (
                      <div className="text-sm text-text-secondary mb-1">{transaction.narration}</div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`text-xs inline-flex items-center gap-2 px-2 py-0.5 border rounded-full ${c.bg} ${c.text} ${c.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                        <span className="capitalize">{transaction.status}</span>
                      </div>
                      <div className="text-xs text-text-tertiary">{formatDate(transaction.date)}</div>
                    </div>
                  </div>
                </div>
                <div className={`font-bold text-lg ${c.amount}`}>{transaction.amount} USDC</div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Load More */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.button 
            className="text-text-primary text-sm font-medium hover:text-text-secondary transition-colors px-4 py-2 rounded-xl hover:bg-surface"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Transactions
          </motion.button>
        </motion.div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        transaction={selectedTransaction}
      />
    </motion.div>
  );
};
