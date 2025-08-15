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

export interface TransactionParams {
  to: string;
  amount: string;
  walletAddress: string;
  isTestnet?: boolean;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
  explorerUrl?: string;
}

/**
 * Send native AVAX transaction on Avalanche network
 * @param params - Transaction parameters
 * @returns Promise<TransactionResult> - Transaction result with hash
 */
export async function sendAVAXTransaction(params: TransactionParams): Promise<TransactionResult> {
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
    
    // Convert amount to wei (AVAX has 18 decimals)
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
 * Check transaction status on blockchain
 * @param txHash - Transaction hash
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise<any> - Transaction receipt
 */
export async function checkTransactionStatus(txHash: string, isTestnet: boolean = false) {
  try {
    const config = isTestnet ? AVALANCHE_CONFIG.testnet : AVALANCHE_CONFIG.mainnet;
    
    const Web3 = (window as any).Web3;
    if (!Web3) {
      throw new Error('Web3 library not loaded');
    }

    const web3 = new Web3(config.rpcUrl);
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    if (receipt) {
      return {
        confirmed: true,
        success: receipt.status,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        explorerUrl: `${config.explorerUrl}/tx/${txHash}`
      };
    } else {
      return {
        confirmed: false,
        pending: true
      };
    }
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return {
      confirmed: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get current network information
 * @returns Promise<any> - Network info
 */
export async function getNetworkInfo() {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    const Web3 = (window as any).Web3;
    if (!Web3) {
      throw new Error('Web3 library not loaded');
    }

    const web3 = new Web3(window.ethereum);
    
    const [networkId, chainId, blockNumber] = await Promise.all([
      web3.eth.net.getId(),
      web3.eth.getChainId(),
      web3.eth.getBlockNumber()
    ]);

    const isAvalanche = Number(chainId) === 43114 || Number(chainId) === 43113;
    const isTestnet = Number(chainId) === 43113;

    return {
      networkId,
      chainId,
      blockNumber,
      isAvalanche,
      isTestnet,
      networkName: isTestnet ? 'Avalanche Fuji Testnet' : 
                   Number(chainId) === 43114 ? 'Avalanche Mainnet' : 
                   'Unknown Network'
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return null;
  }
}
