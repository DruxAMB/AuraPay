import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiConfig, createConfig } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { configureChains, createConfig as createWagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import AppRoutes from './routes/AppRoutes';
import { LoadingProvider } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';
import { privyConfig, PRIVY_APP_ID } from './config/privy';

// Configure wagmi
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalanche, avalancheFuji],
  [publicProvider()]
);

const wagmiConfig = createWagmiConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const App = () => (
  <PrivyProvider
    appId={PRIVY_APP_ID}
    config={privyConfig}
  >
    <WagmiConfig config={wagmiConfig}>
      <div className="dark bg-background min-h-screen font-sans">
        <LoadingProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LoadingProvider>
      </div>
    </WagmiConfig>
  </PrivyProvider>
);

export default App;
