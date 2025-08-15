import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';

export const Settings = () => {
  const { user, isAuthenticated, logout, walletAddress } = useAuth();
  
  // Get user display name from Privy authentication
  const getUserDisplayName = () => {
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
    
    return 'User';
  };

  const [settings, setSettings] = useState({
    name: getUserDisplayName(),
    dailyLimit: '1000',
    monthlyLimit: '10000',
    panicMode: true,
    reversePinPanic: true,
  });
  const [isPinFlowOpen, setIsPinFlowOpen] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinSuccess, setShowPinSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Update display name when user data changes
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        name: getUserDisplayName()
      }));
    }
  }, [user]);

  // Sync panic mode from URL state if available
  useEffect(() => {
    if (location.state?.panicMode !== undefined) {
      setSettings(prev => ({ ...prev, panicMode: location.state.panicMode }));
    }
  }, [location.state]);

  const handleSave = () => {
    console.log('Saving settings:', settings);
    navigate('/home', { state: { panicMode: settings.panicMode } });
  };

  const handlePanicModeToggle = () => {
    const newPanicMode = !settings.panicMode;
    setSettings({ ...settings, panicMode: newPanicMode });

    if (newPanicMode) {
      if (confirm('Are you sure you want to enable Panic Mode? This will disable all transactions.')) {
        setSettings({ ...settings, panicMode: true });
      }
    } else {
      setSettings({ ...settings, panicMode: false });
    }
  };

  const resetPinFlow = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setIsPinFlowOpen(false);
  };

  const canSavePin = () => {
    const pinRegex = /^\d{4}$/;
    return pinRegex.test(oldPin) && pinRegex.test(newPin) && newPin === confirmPin;
  };

  const handleSavePin = () => {
    if (!canSavePin()) return;
    console.log('Updating PIN', { oldPin, newPin });
    resetPinFlow();
    setShowPinSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/30">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-surface-secondary transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-medium text-text-primary">Settings</h1>
        <button 
          onClick={handleSave}
          className="px-3 py-1 border border-border rounded-xl text-sm text-text-primary hover:bg-surface-secondary transition-colors"
        >
          Save
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-0 py-8 space-y-8">
        {/* Profile */}
        <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
          <h2 className="text-sm font-semibold text-text-secondary mb-4">Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Wallet Address Display */}
            {walletAddress && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={walletAddress}
                    readOnly
                    className="input-field pr-20 bg-surface-secondary cursor-default"
                    title={walletAddress}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(walletAddress)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                    title="Copy wallet address"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {user?.linkedAccounts?.find((account: any) => account.type === 'email') 
                    ? 'Embedded wallet created by Privy' 
                    : 'Connected external wallet'
                  }
                </p>
              </div>
            )}

            {/* Authentication Method Display */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Authentication Method
              </label>
              <div className="bg-surface-secondary border border-border/20 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {(() => {
                        const emailAccount = user?.linkedAccounts?.find((account: any) => account.type === 'email');
                        if (emailAccount) {
                          return `Email: ${emailAccount.address}`;
                        }
                        if (user?.wallet) {
                          return 'External Wallet';
                        }
                        return 'Unknown';
                      })()}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {user?.linkedAccounts?.find((account: any) => account.type === 'email') 
                        ? 'Privy embedded wallet with email authentication' 
                        : 'Connected via wallet provider (MetaMask, WalletConnect, etc.)'
                      }
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Limits */}
        <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
          <h2 className="text-sm font-semibold text-text-secondary mb-4">Card Limits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Daily Limit (USDC)
              </label>
              <input
                type="number"
                value={settings.dailyLimit}
                onChange={(e) => setSettings({ ...settings, dailyLimit: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Monthly Limit (USDC)
              </label>
              <input
                type="number"
                value={settings.monthlyLimit}
                onChange={(e) => setSettings({ ...settings, monthlyLimit: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-surface-primary border border-border/20 p-2 shadow-sm rounded-xl">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-text-secondary">Controls</h2>
          <div className="divide-y divide-border/20">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <div className="font-medium text-text-primary">Panic Mode</div>
                <div className="text-sm text-text-secondary">Disable all transactions</div>
              </div>
              <button
                onClick={handlePanicModeToggle}
                className={`w-14 h-7 transition-all duration-300 ${
                  settings.panicMode ? 'bg-red-600' : 'bg-surface-secondary'
                } rounded-xl`}
              >
                <div className={`w-6 h-6 bg-surface transition-transform duration-300 ${
                  settings.panicMode ? 'translate-x-7' : 'translate-x-1'
                } rounded-xl`} />
              </button>
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <div className="font-medium text-text-primary">Reverse PIN triggers Panic Mode</div>
                <div className="text-sm text-text-secondary">Enter PIN backwards to activate panic mode</div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, reversePinPanic: !settings.reversePinPanic })}
                className={`w-14 h-7 transition-all duration-300 ${
                  settings.reversePinPanic ? 'bg-blue-600' : 'bg-surface-secondary'
                } rounded-xl`}
              >
                <div className={`w-6 h-6 bg-surface transition-transform duration-300 ${
                  settings.reversePinPanic ? 'translate-x-7' : 'translate-x-1'
                } rounded-xl`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-surface-primary border border-border/20 p-2 shadow-sm rounded-xl">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-text-secondary">Security</h2>
          <button
            onClick={() => setIsPinFlowOpen(true)}
            className="w-full text-left px-4 py-4 hover:bg-surface-secondary transition-colors"
          >
            <div className="font-medium text-text-primary">Change Card PIN</div>
            <div className="text-sm text-text-secondary">Update your 4-digit PIN</div>
          </button>
        </div>
      </div>

      {/* Change PIN Modal */}
      {isPinFlowOpen && (
        <div className="modal-overlay" onClick={resetPinFlow}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-text-primary">Change Card PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Current PIN</label>
                <input
                  type="password"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  className="input-field"
                  placeholder="••••"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">New PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    className="input-field"
                    placeholder="••••"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Confirm PIN</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    className="input-field"
                    placeholder="••••"
                  />
                </div>
              </div>
              {!canSavePin() && (
                <p className="text-sm text-text-secondary">Enter 4 digits for each field. New PINs must match.</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetPinFlow}
                  className="flex-1 py-3 px-4 bg-surface-secondary text-text-primary rounded-xl font-medium hover:bg-surface-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePin}
                  disabled={!canSavePin()}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    canSavePin()
                      ? 'bg-text-primary text-background hover:bg-text-secondary'
                      : 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  }`}
                >
                  Save PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showPinSuccess}
        onClose={() => setShowPinSuccess(false)}
        type="success"
        title="PIN Updated"
        message="Your card PIN has been updated successfully."
        actionText="Done"
        onAction={() => setShowPinSuccess(false)}
      />
    </div>
  );
};
