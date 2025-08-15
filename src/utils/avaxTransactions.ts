// Real Avalanche AVAX transaction utilities

// Avalanche network configuration
const AVALANCHE_CONFIG = {
  mainnet: {
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io'
  },
  testnet: {
    chainId: 43113,
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://testnet.snowtrace.io'
  }
};

// Transaction parameters interface
interface TransactionParams {
  to: string;
  amount: string;
  walletAddress: string;
  isTestnet?: boolean;
}

/**
 * Send native AVAX transaction
 * @param params - Transaction parameters
 * @returns Promise<any> - Transaction result
 */
export async function sendAVAXTransaction(params: TransactionParams) {
  try {
    // Check if MetaMask is available
    if (!window.ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask extension.');
    }

    const config = params.isTestnet ? AVALANCHE_CONFIG.testnet : AVALANCHE_CONFIG.mainnet;
    
    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const expectedChainId = `0x${config.chainId.toString(16)}`;
    
    if (chainId !== expectedChainId) {
      // Try to switch to the correct network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: expectedChainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Network not added, add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: expectedChainId,
              chainName: params.isTestnet ? 'Avalanche Fuji Testnet' : 'Avalanche Network',
              nativeCurrency: {
                name: 'AVAX',
                symbol: 'AVAX',
                decimals: 18,
              },
              rpcUrls: [config.rpcUrl],
              blockExplorerUrls: [config.explorerUrl],
            }],
          });
        } else {
          throw new Error('Please switch to the correct Avalanche network');
        }
      }
    }

    // Create Web3 instance
    const Web3 = (window as any).Web3;
    if (!Web3) {
      throw new Error('Web3 library not loaded');
    }

    const web3 = new Web3(window.ethereum);
    
    // Convert amount to wei
    const amountWei = web3.utils.toWei(params.amount, 'ether');
    
    // Estimate gas
    const gasEstimate = await web3.eth.estimateGas({
      from: params.walletAddress,
      to: params.to,
      value: amountWei,
    });
    
    // Send transaction
    const transactionParameters = {
      from: params.walletAddress,
      to: params.to,
      value: amountWei,
      gas: Math.ceil(Number(gasEstimate) * 1.2).toString(), // Add 20% buffer
    };

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    console.log('AVAX transaction sent:', txHash);

    return {
      hash: txHash,
      success: true,
      explorerUrl: `${config.explorerUrl}/tx/${txHash}`
    };

  } catch (error: any) {
    console.error('AVAX transaction error:', error);
    
    let errorMessage = 'Transaction failed';
    if (error.code === 4001) {
      errorMessage = 'Transaction rejected by user';
    } else if (error.code === -32603) {
      errorMessage = 'Transaction failed - insufficient funds or network error';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      hash: '',
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Check transaction status
 * @param txHash - Transaction hash
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise<any> - Transaction status
 */
export async function checkTransactionStatus(txHash: string, isTestnet: boolean = false) {
  try {
    const config = isTestnet ? AVALANCHE_CONFIG.testnet : AVALANCHE_CONFIG.mainnet;
    
    // Create Web3 instance
    const Web3 = (window as any).Web3;
    if (!Web3) {
      throw new Error('Web3 library not loaded');
    }

    const web3 = new Web3(config.rpcUrl);
    
    // Get transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return {
        status: 'pending',
        confirmations: 0,
        explorerUrl: `${config.explorerUrl}/tx/${txHash}`
      };
    }

    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber();
    const confirmations = Number(currentBlock) - Number(receipt.blockNumber);

    return {
      status: receipt.status ? 'confirmed' : 'failed',
      confirmations,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      explorerUrl: `${config.explorerUrl}/tx/${txHash}`
    };

  } catch (error) {
    console.error('Error checking transaction status:', error);
    return {
      status: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      explorerUrl: `${isTestnet ? AVALANCHE_CONFIG.testnet.explorerUrl : AVALANCHE_CONFIG.mainnet.explorerUrl}/tx/${txHash}`
    };
  }
}

/**
 * Get network information
 * @param isTestnet - Whether to get testnet or mainnet info
 * @returns Network configuration
 */
export function getNetworkInfo(isTestnet: boolean = false) {
  return isTestnet ? AVALANCHE_CONFIG.testnet : AVALANCHE_CONFIG.mainnet;
}

/**
 * Validate if an address is a valid Ethereum/Avalanche address
 * @param address - The address to validate
 * @returns boolean - Whether the address is valid
 */
export function isValidAddress(address: string): boolean {
  if (!address) return false;
  
  // Check if Web3 is available for validation
  if (typeof window !== 'undefined' && (window as any).Web3) {
    const Web3 = (window as any).Web3;
    const web3 = new Web3();
    return web3.utils.isAddress(address);
  }
  
  // Basic validation if Web3 not available
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format AVAX amount with proper decimal places
 * @param amount - The AVAX amount as string
 * @returns string - Formatted amount
 */
export function formatAVAXAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.0000';
  
  // Format with 4 decimal places for AVAX
  return num.toFixed(4);
}
