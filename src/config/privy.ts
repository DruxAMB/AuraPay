import type { PrivyClientConfig } from '@privy-io/react-auth';

export const privyConfig: PrivyClientConfig = {
  // Appearance customization to match AuraPay's dark theme
  appearance: {
    theme: 'dark',
    accentColor: '#00AFFF',
    logo: 'https://your-logo-url.com/logo.png', // Replace with actual logo
    walletChainType: 'ethereum-only',
    showWalletLoginFirst: true,
  },
  
  // Embedded wallet configuration
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
  },

  // Login methods configuration
  loginMethods: [
    'wallet',
    'email',
    'google',
    'twitter',
    'discord',
  ],

  // Supported chains - Avalanche mainnet and testnet
  supportedChains: [
    {
      id: 43114, // Avalanche C-Chain
      name: 'Avalanche',
      network: 'avalanche',
      nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ['https://api.avax.network/ext/bc/C/rpc'],
        },
        public: {
          http: ['https://api.avax.network/ext/bc/C/rpc'],
        },
      },
      blockExplorers: {
        default: {
          name: 'SnowTrace',
          url: 'https://snowtrace.io',
        },
      },
    },
    {
      id: 43113, // Avalanche Fuji Testnet
      name: 'Avalanche Fuji',
      network: 'avalanche-fuji',
      nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ['https://api.avax-test.network/ext/bc/C/rpc'],
        },
        public: {
          http: ['https://api.avax-test.network/ext/bc/C/rpc'],
        },
      },
      blockExplorers: {
        default: {
          name: 'SnowTrace Testnet',
          url: 'https://testnet.snowtrace.io',
        },
      },
    },
  ],

  // Default chain
  defaultChain: {
      id: 43114,
      name: 'Avalanche',
      nativeCurrency: {
          name: '',
          symbol: '',
          decimals: 0
      },
      rpcUrls: {
          default: {
              http: [],
              webSocket: undefined
          }
      }
  },
};

// USDC contract addresses on Avalanche
export const USDC_CONTRACTS = {
  mainnet: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // USDC on Avalanche
  testnet: '0x5425890298aed601595a70AB815c96711a31Bc65', // USDC on Fuji testnet
} as const;

// Environment variables
export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || 'cmect48v8011jla0c6m50q4ig';

// Note: If you get "OAuth client was not found" error, you need to:
// 1. Create a new app at https://dashboard.privy.io/
// 2. Add http://localhost:5173 to allowed origins
// 3. Update VITE_PRIVY_APP_ID in your .env file with the new App ID

if (!PRIVY_APP_ID) {
  throw new Error('PRIVY_APP_ID is required. Please set VITE_PRIVY_APP_ID in your environment variables.');
}
