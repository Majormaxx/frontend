/**
 * Types for Safe Multisig Payout System
 * Based on the functional specification for Token Payments via SAFE Multisig
 */

export type TokenType = 'stablecoin' | 'recognition';

export type PayoutStatus = 'draft' | 'proposed' | 'executed' | 'partial' | 'failed';

export type TransactionStatus = 'proposed' | 'executed' | 'failed' | 'canceled';

export type PayoutType = 'round' | 'manual';

/**
 * Individual recipient for a payout
 */
export interface PayoutRecipient {
  id: string;
  userId: string;
  walletAddress: string;
  tokenType: TokenType;
  tokenAddress: string;
  tokenDecimals: number;
  amountHuman: string; // Human readable amount (e.g., "230.50")
  amountBaseUnits: string; // Base units amount (e.g., "230500000" for 6 decimals)
  status: 'pending' | 'proposed' | 'executed' | 'failed' | 'skipped';
  error?: string;
  txProposalId?: string;
  partIndex?: number;
  partCount?: number;
  attempt?: number;
}

/**
 * Safe transaction proposal data
 */
export interface SafeTransactionProposal {
  id: string;
  payoutId: string;
  payoutType: PayoutType;
  tokenType: TokenType;
  partIndex: number;
  partCount: number;
  attempt: number;
  retryOfTxProposalId?: string;
  safeTxHash?: string;
  status: TransactionStatus;
  proposedAt: string;
  executedAt?: string;
  payloadJson: SafeTransactionData[];
  explorerUrl?: string;
}

/**
 * Main payout record
 */
export interface Payout {
  id: string;
  organizationId: string;
  roundId?: string;
  status: PayoutStatus;
  totalStablePayout: string;
  totalRecognitionPayout: string;
  createdAt: string;
  updatedAt: string;
  recipients: PayoutRecipient[];
  txProposals: SafeTransactionProposal[];
}

/**
 * Safe transaction data structure for MultiSend
 */
export interface SafeTransactionData {
  to: string;
  value: string;
  data: string;
  operation?: number; // 0 for CALL, 1 for DELEGATECALL
}

/**
 * Token information for payouts
 */
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance?: string;
}

/**
 * Safe information
 */
export interface SafeInfo {
  address: string;
  owners: string[];
  threshold: number;
  version: string;
  chainId: number;
}

/**
 * Payout preview data
 */
export interface PayoutPreview {
  roundId: string;
  recipients: PayoutRecipient[];
  totals: {
    stablecoin: {
      amountHuman: string;
      amountBaseUnits: string;
      tokenInfo: TokenInfo;
    };
    recognition: {
      amountHuman: string;
      amountBaseUnits: string;
      tokenInfo: TokenInfo;
    };
  };
  warnings: string[];
  chunkPlan: {
    stablecoin: {
      totalChunks: number;
      recipientsPerChunk: number;
    };
    recognition: {
      totalChunks: number;
      recipientsPerChunk: number;
    };
  };
  safeInfo: SafeInfo;
}

/**
 * Round data for payouts
 */
export interface PayoutRound {
  id: string;
  roundNumber: number;
  status: number; // RoundStatus enum
  compensationCycleStartDate: string;
  compensationCycleEndDate: string;
  startDate: string;
  endDate: string;
  hasIncompletePayouts: boolean;
  totalStableAmount?: string;
  totalRecognitionAmount?: string;
  recipientCount?: number;
}

/**
 * API request/response types
 */
export interface GetPayoutRoundsResponse {
  rounds: PayoutRound[];
}

export interface GetPayoutPreviewRequest {
  roundId: string;
}

export interface GetPayoutPreviewResponse {
  preview: PayoutPreview;
}

export interface ProposePayoutRequest {
  roundId: string;
  tokenType: TokenType;
}

export interface ProposePayoutResponse {
  payoutId: string;
  txProposalId: string;
  safeTxHash: string;
  safeUrl: string;
}

export interface GetPayoutStatusRequest {
  roundId: string;
}

export interface GetPayoutStatusResponse {
  payouts: Payout[];
}

/**
 * Manual payout request
 */
export interface ManualPayoutRequest {
  recipients: {
    walletAddress: string;
    amountHuman: string;
  }[];
  tokenType: TokenType;
  description?: string;
}

/**
 * CSV export data structure
 */
export interface PayoutExportData {
  roundId: string;
  payoutType: PayoutType;
  tokenType: TokenType;
  partIndex: number;
  partCount: number;
  attempt: number;
  safeTxHash?: string;
  status: TransactionStatus;
  proposedAt: string;
  executedAt?: string;
  explorerUrl?: string;
  walletAddress: string;
  amountHuman: string;
  amountBaseUnits: string;
  recipientStatus: string;
  error?: string;
}

/**
 * Validation result for Safe configuration
 */
export interface SafeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  safeInfo?: SafeInfo;
  tokenInfo?: {
    stablecoin: TokenInfo & { balance?: string };
    recognition: TokenInfo & { balance?: string; hasMinterRole?: boolean };
  };
}

/**
 * Chunking configuration
 */
export interface ChunkingConfig {
  maxRecipientsPerChunk: number;
  maxGasLimit: number;
  maxCalldataSize: number;
}
