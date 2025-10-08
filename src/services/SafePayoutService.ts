/**
 * Safe Payout Service
 * Handles Safe multisig transaction creation and management for payouts
 */

import { ethers } from 'ethers';
import { useEthersSigner } from '@/utils/hooks/useEthersSigner';
import { useAccount } from 'wagmi';
import { 
  SafeTransactionData, 
  TokenInfo, 
  SafeInfo, 
  PayoutRecipient, 
  ChunkingConfig,
  SafeValidationResult 
} from '@/@types/safe-payouts';

// ERC20 ABI for transfer function
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function balanceOf(address account) view returns (uint256)',
  'function hasRole(bytes32 role, address account) view returns (bool)'
];

// AccessControl MINTER_ROLE
const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';

// Default chunking configuration
const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  maxRecipientsPerChunk: 100,
  maxGasLimit: 10000000, // 10M gas
  maxCalldataSize: 100000 // 100KB
};

/**
 * Safe Payout Service Hook
 */
export const useSafePayoutService = () => {
  const { address } = useAccount();
  const ethersSigner = useEthersSigner();

  /**
   * Validates Safe configuration and token setup
   */
  const validateSafeConfiguration = async (
    safeAddress: string,
    stablecoinAddress: string,
    recognitionTokenAddress: string,
    recognitionMode: 'hours-based' | 'discretionary',
    chainId: number
  ): Promise<SafeValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      if (!ethersSigner) {
        errors.push('Wallet not connected');
        return { isValid: false, errors, warnings };
      }

      const provider = ethersSigner.provider;

      // Validate Safe address is a contract
      const safeCode = await provider.getCode(safeAddress);
      if (safeCode === '0x') {
        errors.push('Safe address is not a valid contract');
      }

      // Validate token addresses
      const stablecoinCode = await provider.getCode(stablecoinAddress);
      if (stablecoinCode === '0x') {
        errors.push('Stablecoin address is not a valid contract');
      }

      const recognitionTokenCode = await provider.getCode(recognitionTokenAddress);
      if (recognitionTokenCode === '0x') {
        errors.push('Recognition token address is not a valid contract');
      }

      if (errors.length > 0) {
        return { isValid: false, errors, warnings };
      }

      // Get token information
      const stablecoinContract = new ethers.Contract(stablecoinAddress, ERC20_ABI, provider);
      const recognitionTokenContract = new ethers.Contract(recognitionTokenAddress, ERC20_ABI, provider);

      const [
        stablecoinName,
        stablecoinSymbol,
        stablecoinDecimals,
        stablecoinBalance,
        recognitionTokenName,
        recognitionTokenSymbol,
        recognitionTokenDecimals,
        recognitionTokenBalance
      ] = await Promise.all([
        stablecoinContract.name(),
        stablecoinContract.symbol(),
        stablecoinContract.decimals(),
        stablecoinContract.balanceOf(safeAddress),
        recognitionTokenContract.name(),
        recognitionTokenContract.symbol(),
        recognitionTokenContract.decimals(),
        recognitionTokenContract.balanceOf(safeAddress)
      ]);

      // Check minter role for recognition token if mode is hours-based (TeamPoints mint)
      let hasMinterRole = false;
      if (recognitionMode === 'hours-based') {
        try {
          hasMinterRole = await recognitionTokenContract.hasRole(MINTER_ROLE, safeAddress);
          if (!hasMinterRole) {
            errors.push('Safe does not have MINTER_ROLE for recognition token');
          }
        } catch (error) {
          warnings.push('Could not verify MINTER_ROLE - token may not support AccessControl');
        }
      }

      const tokenInfo = {
        stablecoin: {
          address: stablecoinAddress,
          name: stablecoinName,
          symbol: stablecoinSymbol,
          decimals: Number(stablecoinDecimals),
          balance: ethers.formatUnits(stablecoinBalance, stablecoinDecimals)
        },
        recognition: {
          address: recognitionTokenAddress,
          name: recognitionTokenName,
          symbol: recognitionTokenSymbol,
          decimals: Number(recognitionTokenDecimals),
          balance: ethers.formatUnits(recognitionTokenBalance, recognitionTokenDecimals),
          hasMinterRole
        }
      };

      // TODO: Get actual Safe info when Safe SDK is available
      const safeInfo: SafeInfo = {
        address: safeAddress,
        owners: [], // Will be populated by Safe SDK
        threshold: 1, // Will be populated by Safe SDK
        version: '1.3.0', // Will be populated by Safe SDK
        chainId
      };

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        safeInfo,
        tokenInfo
      };

    } catch (error: any) {
      errors.push(`Validation failed: ${error.message}`);
      return { isValid: false, errors, warnings };
    }
  };

  /**
   * Creates ERC20 transfer transaction data
   */
  const createTransferTransaction = (
    tokenAddress: string,
    recipient: string,
    amountBaseUnits: string
  ): SafeTransactionData => {
    const tokenInterface = new ethers.Interface(ERC20_ABI);
    const data = tokenInterface.encodeFunctionData('transfer', [recipient, amountBaseUnits]);

    return {
      to: tokenAddress,
      value: '0',
      data,
      operation: 0 // CALL
    };
  };

  /**
   * Creates ERC20 mint transaction data
   */
  const createMintTransaction = (
    tokenAddress: string,
    recipient: string,
    amountBaseUnits: string
  ): SafeTransactionData => {
    const tokenInterface = new ethers.Interface(ERC20_ABI);
    const data = tokenInterface.encodeFunctionData('mint', [recipient, amountBaseUnits]);

    return {
      to: tokenAddress,
      value: '0',
      data,
      operation: 0 // CALL
    };
  };

  /**
   * Creates batch transaction data for multiple recipients
   */
  const createBatchTransactions = (
    recipients: PayoutRecipient[],
    tokenAddress: string,
    isRecognitionToken: boolean,
    recognitionMode: 'hours-based' | 'discretionary'
  ): SafeTransactionData[] => {
    return recipients.map(recipient => {
      // For recognition tokens in hours-based mode, use mint; otherwise use transfer
      const shouldMint = isRecognitionToken && recognitionMode === 'hours-based';
      
      if (shouldMint) {
        return createMintTransaction(tokenAddress, recipient.walletAddress, recipient.amountBaseUnits);
      } else {
        return createTransferTransaction(tokenAddress, recipient.walletAddress, recipient.amountBaseUnits);
      }
    });
  };

  /**
   * Chunks recipients into smaller batches for gas optimization
   */
  const chunkRecipients = (
    recipients: PayoutRecipient[],
    config: ChunkingConfig = DEFAULT_CHUNKING_CONFIG
  ): PayoutRecipient[][] => {
    const chunks: PayoutRecipient[][] = [];
    
    for (let i = 0; i < recipients.length; i += config.maxRecipientsPerChunk) {
      chunks.push(recipients.slice(i, i + config.maxRecipientsPerChunk));
    }
    
    return chunks;
  };

  /**
   * Estimates gas for a batch of transactions
   */
  const estimateGasForBatch = async (
    transactions: SafeTransactionData[]
  ): Promise<bigint> => {
    // This is a simplified estimation
    // In a real implementation, you would use Safe SDK to estimate gas
    const baseGasPerTransaction = 50000n; // Base gas per transaction
    return BigInt(transactions.length) * baseGasPerTransaction;
  };

  /**
   * Validates wallet addresses
   */
  const validateWalletAddresses = (recipients: PayoutRecipient[]): string[] => {
    const errors: string[] = [];
    const seenAddresses = new Set<string>();

    recipients.forEach((recipient, index) => {
      if (!ethers.isAddress(recipient.walletAddress)) {
        errors.push(`Invalid wallet address at index ${index}: ${recipient.walletAddress}`);
      }

      if (seenAddresses.has(recipient.walletAddress.toLowerCase())) {
        errors.push(`Duplicate wallet address: ${recipient.walletAddress}`);
      }

      seenAddresses.add(recipient.walletAddress.toLowerCase());
    });

    return errors;
  };

  /**
   * Converts human-readable amounts to base units
   */
  const convertToBaseUnits = (
    amountHuman: string,
    decimals: number
  ): string => {
    try {
      return ethers.parseUnits(amountHuman, decimals).toString();
    } catch (error) {
      throw new Error(`Invalid amount: ${amountHuman}`);
    }
  };

  /**
   * Converts base units to human-readable amounts
   */
  const convertToHumanUnits = (
    amountBaseUnits: string,
    decimals: number
  ): string => {
    try {
      return ethers.formatUnits(amountBaseUnits, decimals);
    } catch (error) {
      throw new Error(`Invalid base units: ${amountBaseUnits}`);
    }
  };

  return {
    validateSafeConfiguration,
    createTransferTransaction,
    createMintTransaction,
    createBatchTransactions,
    chunkRecipients,
    estimateGasForBatch,
    validateWalletAddresses,
    convertToBaseUnits,
    convertToHumanUnits,
    isConnected: !!ethersSigner && !!address
  };
};
