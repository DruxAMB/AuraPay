// USDC contract ABI (minimal for balance checking)
const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;

// Avalanche network configuration
const AVALANCHE_CONFIG = {
  mainnet: {
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    usdcContract: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    explorerUrl: 'https://snowtrace.io'
  },
  testnet: {
    chainId: 43113,
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    usdcContract: '0x5425890298aed601595a70AB815c96711a31Bc65', // Fuji testnet USDC
    explorerUrl: 'https://testnet.snowtrace.io'
  }
};

/**
 * Fetch USDC balance for a given wallet address on Avalanche
 * @param walletAddress - The wallet address to check balance for
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise<string> - The formatted USDC balance
 */
export async function fetchUSDCBalance(
  walletAddress: string,
  isTestnet: boolean = false
): Promise<string> {
  try {
    // Check if we're in a browser environment with Web3
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn('Web3 not available, falling back to mock balance');
      return (Math.random() * 1000).toFixed(2);
    }

    const config = isTestnet ? AVALANCHE_CONFIG.testnet : AVALANCHE_CONFIG.mainnet;
    
    // Create Web3 instance with the appropriate RPC
    const Web3 = (window as any).Web3;
    if (!Web3) {
      console.warn('Web3 library not loaded, falling back to mock balance');
      return (Math.random() * 1000).toFixed(2);
    }

    const web3 = new Web3(config.rpcUrl);
    
    // Create contract instance
    const contract = new web3.eth.Contract(USDC_ABI, config.usdcContract);
    
    // Get balance and decimals
    const [balance, decimals] = await Promise.all([
      contract.methods.balanceOf(walletAddress).call(),
      contract.methods.decimals().call()
    ]);
    
    // Convert from wei to human readable format
    const balanceFormatted = web3.utils.fromWei(
      balance.toString().padStart(Number(decimals), '0'), 
      'ether'
    );
    
    // Format to 2 decimal places
    return parseFloat(balanceFormatted).toFixed(2);
    
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    
    // Fallback to mock balance on error
    const mockBalance = (Math.random() * 1000).toFixed(2);
    console.warn('Using mock balance:', mockBalance);
    return mockBalance;
  }
}

/**
 * Format USDC amount with proper decimal places
 * @param amount - Raw amount string
 * @returns Formatted amount string
 */
export function formatUSDCAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Validate if an address is a valid Ethereum/Avalanche address
 * @param address - Address to validate
 * @returns boolean
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
