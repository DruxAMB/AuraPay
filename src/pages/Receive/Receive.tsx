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
  const navigate = useNavigate();
  const { isAuthenticated, walletAddress } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

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
        <div className="text-lg text-text-secondary mb-8">Waiting to Scan NFC Card...</div>
        <div className="w-16 h-16 border-2 border-border border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <button
          onClick={() => setCurrentStep('card-pin')}
          className="text-text-primary text-sm font-medium"
        >
          Open Camera to Scan QR
        </button>
      </div>
    </div>
  );

  const renderCardPinStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <p className="text-sm text-text-secondary mb-4">
          Entering your PIN will authorise a transfer of {receiveData.amount} USDC to {receiveData.receiver}.
        </p>
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index < pin.length ? 'bg-surface border-border' : 'border-border/40'
              }`}
            />
          ))}
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
