import { useState } from 'react';
import { sendAVAXTransaction, checkTransactionStatus } from '../utils/transactions';
import { useAuth } from '../contexts/AuthContext';

export const TestTransaction = () => {
  const { walletAddress, avaxBalance, refreshBalance } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [txResult, setTxResult] = useState<any>(null);
  const [txStatus, setTxStatus] = useState<any>(null);

  // Test recipient address (your own address for a self-transaction)
  const testRecipient = walletAddress || '';
  const testAmount = '0.0001'; // Very small amount for testing

  const handleSendTestTransaction = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setTxResult(null);
    setTxStatus(null);

    try {
      console.log('Sending test AVAX transaction...');
      
      const result = await sendAVAXTransaction({
        to: testRecipient, // Send to yourself
        amount: testAmount,
        walletAddress: walletAddress,
        isTestnet: true // Use Fuji testnet
      });

      setTxResult(result);
      console.log('Transaction result:', result);

      if (result.success && result.hash) {
        // Check transaction status
        setTimeout(async () => {
          const status = await checkTransactionStatus(result.hash, true);
          setTxStatus(status);
          console.log('Transaction status:', status);
          
          // Refresh balance after transaction
          setTimeout(() => {
            refreshBalance();
          }, 2000);
        }, 3000);
      }

    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxResult({ success: false, error: error.message || 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-surface border border-border/20 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Test AVAX Transaction</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Current Balance
              </label>
              <div className="text-xl font-bold text-text-primary">
                {avaxBalance} AVAX
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Your Wallet Address
              </label>
              <div className="text-sm text-text-primary bg-surface-secondary p-2 rounded border break-all">
                {walletAddress || 'Not connected'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Test Transaction Details
              </label>
              <div className="text-sm text-text-secondary">
                • <strong>To:</strong> {testRecipient.slice(0, 10)}...{testRecipient.slice(-8)} (yourself)
                <br />
                • <strong>Amount:</strong> {testAmount} AVAX
                <br />
                • <strong>Network:</strong> Avalanche Fuji Testnet
              </div>
            </div>

            <button
              onClick={handleSendTestTransaction}
              disabled={isLoading || !walletAddress}
              className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending Transaction...' : 'Send Test Transaction'}
            </button>

            {txResult && (
              <div className={`p-4 rounded-xl ${txResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className={`font-medium ${txResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  Transaction {txResult.success ? 'Sent!' : 'Failed'}
                </h3>
                
                {txResult.success ? (
                  <div className="mt-2 text-sm text-green-700">
                    <p><strong>Hash:</strong> {txResult.hash}</p>
                    <a 
                      href={txResult.explorerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on Snowtrace →
                    </a>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-red-700">{txResult.error}</p>
                )}
              </div>
            )}

            {txStatus && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-medium text-blue-800">Transaction Status</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p><strong>Status:</strong> {txStatus.status}</p>
                  <p><strong>Confirmations:</strong> {txStatus.confirmations}</p>
                  {txStatus.blockNumber && <p><strong>Block:</strong> {txStatus.blockNumber}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
