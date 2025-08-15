import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, QrCodeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

type ReceiveStep = 'options' | 'address' | 'card-amount' | 'card-waiting' | 'card-pin';

export const Receive = () => {
  const [currentStep, setCurrentStep] = useState<ReceiveStep>('options');
  const [receiveData, setReceiveData] = useState({
    amount: '',
    narration: '',
    receiver: 'John Doe',
  });
  const [pin, setPin] = useState('');
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcReading, setNfcReading] = useState(false);
  const [nfcError, setNfcError] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [simulatedTxHash, setSimulatedTxHash] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, walletAddress } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Check NFC support
  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  // Simulate transaction processing (based on your Avalanche testnet example)
  const simulateTransaction = async (cardData: any) => {
    setTransactionStatus('⏳ Processing transaction...');
    
    // Generate realistic transaction hash (like your testnet example)
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    setSimulatedTxHash(txHash);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate transaction confirmation (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      setTransactionStatus(`✅ Transaction confirmed! Hash: ${txHash.slice(0, 10)}...`);
      
      // Optional: Send to backend for persistence
      try {
        // Uncomment when backend is ready:
        // await fetch('/api/nfc/tap', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     ...cardData,
        //     transaction_hash: txHash,
        //     status: 'completed'
        //   })
        // });
        
        console.log('Transaction simulated successfully:', {
          ...cardData,
          transaction_hash: txHash,
          status: 'completed',
          block_number: Math.floor(Math.random() * 1000000) + 5000000,
          gas_used: '21000',
          confirmations: 1
        });
      } catch (error) {
        console.error('Backend error:', error);
      }
      
      return true;
    } else {
      setTransactionStatus('❌ Transaction failed - please try again');
      return false;
    }
  };

  // Real NFC card reading function
  const readNFCCard = async () => {
    if (!('NDEFReader' in window)) {
      alert('NFC is not supported on this device');
      return;
    }

    setNfcReading(true);
    setNfcError('');

    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      
      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
        console.log('NFC card detected:', { serialNumber, message });
        
        // Process the NFC card data
        const cardData = {
          cardIdentifier: serialNumber,
          cardName: `NFC Card ${serialNumber?.slice(-4)}`,
          amount: receiveData.amount,
          type: 'received'
        };
        
        // Optional: Send to backend
        // fetch('/api/nfc/tap', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(cardData)
        // });
        
        console.log('Processing NFC transaction:', cardData);
        
        // Store card info and proceed to PIN
        setReceiveData(prev => ({ 
          ...prev, 
          receiver: `NFC Card (${serialNumber?.slice(-8)})` 
        }));
        
        setCurrentStep('card-pin');
        setNfcReading(false);
      });

      ndef.addEventListener('readingerror', () => {
        setNfcError('Failed to read NFC card. Please try again.');
        setNfcReading(false);
      });

    } catch (error) {
      console.error('NFC Error:', error);
      setNfcError('NFC permission denied or not available');
      setNfcReading(false);
      alert('NFC permission denied or error occurred');
    }
  };

  const renderOptionsStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-lg text-text-secondary">Choose how you want to receive</p>
      </div>
      
      <button
        onClick={() => setCurrentStep('address')}
        className="w-full bg-surface border border-border/20 rounded-xl p-6 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-secondary border border-border/20 rounded-xl flex items-center justify-center">
            <QrCodeIcon className="w-6 h-6 text-text-primary" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-lg text-text-primary">Receive with Address</div>
            <div className="text-sm text-text-secondary">Share your wallet address</div>
          </div>
        </div>
      </button>

      <button
        onClick={() => setCurrentStep('card-amount')}
        className="w-full bg-surface border border-border/20 rounded-xl p-6 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-secondary border border-border/20 rounded-xl flex items-center justify-center">
            <CreditCardIcon className="w-6 h-6 text-text-primary" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-lg text-text-primary">Receive with Card</div>
            <div className="text-sm text-text-secondary">NFC card transfer</div>
          </div>
        </div>
      </button>
    </div>
  );

  const renderAddressStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-text-primary">Your Wallet Address</h2>
        <div className="w-48 h-48 bg-surface border border-border/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <QrCodeIcon className="w-24 h-24 text-text-primary" />
        </div>
        <div className="bg-surface border border-border/20 rounded-xl p-3 mb-4">
          <div className="text-sm text-text-secondary mb-2">Wallet Address</div>
          <div className="font-mono text-sm break-all text-text-primary">
            {walletAddress || 'Loading wallet address...'}
          </div>
        </div>
        <button 
          onClick={() => {
            if (walletAddress) {
              navigator.clipboard.writeText(walletAddress);
              // Could add toast notification here
            }
          }}
          className="text-text-primary text-sm font-medium hover:text-text-secondary transition-colors"
          disabled={!walletAddress}
        >
          {walletAddress ? 'Copy Address' : 'Loading...'}
        </button>
      </div>
      
      <div className="bg-surface border border-border/40 rounded-xl p-4 text-left">
        <p className="text-sm text-text-secondary">
          ⚠️ Ensure you send on Ethereum to avoid loss of funds.
        </p>
      </div>
    </div>
  );

  const renderCardAmountStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Amount to Receive
        </label>
        <input
          type="number"
          value={receiveData.amount}
          onChange={(e) => setReceiveData({ ...receiveData, amount: e.target.value })}
          placeholder="0.00"
          className="w-full bg-surface border border-border/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border/60 text-center text-2xl font-bold"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Narration (optional)
        </label>
        <input
          type="text"
          value={receiveData.narration}
          onChange={(e) => setReceiveData({ ...receiveData, narration: e.target.value })}
          placeholder="Enter narration"
          className="w-full bg-surface border border-border/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border/60"
        />
      </div>
    </div>
  );

  const renderCardWaitingStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="text-3xl font-bold mb-4 text-text-primary">{receiveData.amount} USDC</div>
        <div className="text-lg text-text-secondary mb-8">Waiting for NFC Card Tap...</div>
        
        {/* NFC Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 border-2 border-blue-500/30 rounded-full mx-auto flex items-center justify-center">
            <CreditCardIcon className="w-12 h-12 text-blue-400" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-2 border-blue-500/50 rounded-full mx-auto animate-ping"></div>
          <div className="absolute inset-0 w-32 h-32 border border-blue-500/20 rounded-full mx-auto animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-text-secondary mb-4">
            Tap your NFC card or use one of the simulation options below:
          </p>
          
          {/* Real NFC and Simulation Options */}
          <div className="space-y-3">
            {nfcSupported && (
              <button
                onClick={readNFCCard}
                disabled={nfcReading}
                className={`w-full py-3 px-4 rounded-xl transition-colors ${
                  nfcReading 
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 cursor-not-allowed'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                }`}
              >
                {nfcReading ? '📡 Reading NFC Card...' : '📱 Read Real NFC Card'}
              </button>
            )}
            
            <button
              onClick={async () => {
                // Simulate NFC card data
                const cardData = {
                  cardIdentifier: `nfc_${Date.now()}`,
                  cardName: 'Simulated NFC Card',
                  amount: receiveData.amount,
                  type: 'received'
                };
                
                setReceiveData(prev => ({ 
                  ...prev, 
                  receiver: 'Simulated NFC Card' 
                }));
                
                // Move to PIN step first
                setCurrentStep('card-pin');
                
                // Then simulate transaction processing
                setTimeout(async () => {
                  await simulateTransaction(cardData);
                }, 1000);
              }}
              className="w-full bg-green-500/10 border border-green-500/20 text-green-400 py-3 px-4 rounded-xl hover:bg-green-500/20 transition-colors"
            >
              🟢 Simulate Successful NFC Tap
            </button>
            
            <button
              onClick={() => setCurrentStep('card-pin')}
              className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 py-3 px-4 rounded-xl hover:bg-blue-500/20 transition-colors"
            >
              📱 Simulate QR Code Scan
            </button>
            
            <button
              onClick={() => {
                // Simulate failed NFC read
                alert('NFC read failed. Please try again.');
              }}
              className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-3 px-4 rounded-xl hover:bg-red-500/20 transition-colors"
            >
              🔴 Simulate Failed NFC Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCardPinStep = () => (
    <div className="text-center w-fit mx-auto">
      <div className="mb-6">
        <p className="text-sm text-text-secondary mb-4">
          Entering your PIN will authorise a transfer of {receiveData.amount} USDC to {receiveData.receiver}.
        </p>
        
        {/* Transaction Status Display */}
        {transactionStatus && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${
            transactionStatus.includes('✅') 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : transactionStatus.includes('❌')
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          }`}>
            {transactionStatus}
            {simulatedTxHash && (
              <div className="mt-2 text-xs font-mono break-all opacity-70">
                TX: {simulatedTxHash}
              </div>
            )}
          </div>
        )}
        
        {/* NFC Error Display */}
        {nfcError && (
          <div className="mb-4 p-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">
            {nfcError}
          </div>
        )}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                index < pin.length 
                  ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/30' 
                  : 'border-gray-400 bg-transparent'
              }`}
            />
          ))}
        </div>
        
        {/* Virtual Keypad */}
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => {
                if (pin.length < 4) {
                  setPin(pin + num.toString());
                }
              }}
              className="w-16 h-16 bg-surface border border-border/20 rounded-xl text-text-primary text-xl font-semibold hover:bg-surface-secondary transition-colors"
            >
              {num}
            </button>
          ))}
          <div></div>
          <button
            onClick={() => {
              if (pin.length < 4) {
                setPin(pin + '0');
              }
            }}
            className="w-16 h-16 bg-surface border border-border/20 rounded-xl text-text-primary text-xl font-semibold hover:bg-surface-secondary transition-colors"
          >
            0
          </button>
          <button
            onClick={() => setPin(pin.slice(0, -1))}
            className="w-16 h-16 bg-surface border border-border/20 rounded-xl text-text-primary text-lg hover:bg-surface-secondary transition-colors flex items-center justify-center"
          >
            ⌫
          </button>
        </div>
        
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value.slice(0, 4))}
          className="opacity-0 absolute pointer-events-none"
          autoFocus
        />
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'options': return 'Receive USDC';
      case 'address': return 'Your Wallet Address';
      case 'card-amount': return 'Receive with Card';
      case 'card-waiting': return 'Receive with Card';
      case 'card-pin': return 'Enter PIN';
      default: return '';
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'card-amount': return receiveData.amount;
      case 'card-pin': return pin.length === 4;
      default: return true;
    }
  };

  const handleBack = () => {
    if (currentStep === 'options') {
      navigate('/home');
      return;
    }
    if (currentStep === 'address') setCurrentStep('options');
    else if (currentStep === 'card-amount') setCurrentStep('options');
    else if (currentStep === 'card-waiting') setCurrentStep('card-amount');
    else if (currentStep === 'card-pin') setCurrentStep('card-waiting');
  };

  const handleContinue = () => {
    if (currentStep === 'card-amount') {
      if (receiveData.amount) {
        setCurrentStep('card-waiting');
      }
    } else if (currentStep === 'card-pin') {
      if (pin.length === 4) {
        // Process receive
        console.log('Processing receive:', { ...receiveData, pin });
        navigate('/home');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <button onClick={handleBack} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{getStepTitle()}</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {currentStep === 'options' && renderOptionsStep()}
        {currentStep === 'address' && renderAddressStep()}
        {currentStep === 'card-amount' && renderCardAmountStep()}
        {currentStep === 'card-waiting' && renderCardWaitingStep()}
        {currentStep === 'card-pin' && renderCardPinStep()}
      </div>

      {/* Continue Button */}
      {(currentStep === 'card-amount' || currentStep === 'card-pin') && (
        <div className="p-4 border-t border-border/20">
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={`w-full py-4 rounded-xl font-bold transition-colors ${
              canContinue()
                ? 'bg-surface border border-border text-text-primary hover:bg-surface-secondary'
                : 'bg-blue-500/10 text-text-secondary border border-blue-500/20 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};
