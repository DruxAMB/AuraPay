import { PrivyProvider } from '@privy-io/react-auth';

import AppRoutes from './routes/AppRoutes';
import { LoadingProvider } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';
import { privyConfig, PRIVY_APP_ID } from './config/privy';

const App = () => (
  <PrivyProvider
    appId={PRIVY_APP_ID}
    config={privyConfig}
  >
    <div className="dark bg-background min-h-screen font-sans">
      <LoadingProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LoadingProvider>
    </div>
  </PrivyProvider>
);

export default App;
