/**
 * Mock data for payout system
 */

import {
  PayoutRound,
  PayoutRecipient,
  Payout,
  SafeTransactionProposal,
  TokenInfo,
  SafeInfo
} from '@/@types/safe-payouts';

// Mock Safe Information
export const mockSafeInfo: SafeInfo = {
  address: '0x1234567890123456789012345678901234567890',
  owners: [
    '0xOwner1234567890123456789012345678901234',
    '0xOwner2234567890123456789012345678901234',
    '0xOwner3234567890123456789012345678901234'
  ],
  threshold: 2,
  version: '1.3.0',
  chainId: 421614 // Arbitrum Sepolia
};

// Mock Token Information
export const mockStablecoinInfo: TokenInfo = {
  address: '0xStable1234567890123456789012345678901234',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  balance: '100000000000' // 100,000 USDC
};

export const mockRecognitionTokenInfo: TokenInfo = {
  address: '0xRecogn1234567890123456789012345678901234',
  symbol: 'TP',
  name: 'Team Points',
  decimals: 18,
  balance: '50000000000000000000000' // 50,000 TP
};

// Mock Payout Rounds
export const mockPayoutRounds: PayoutRound[] = [
  {
    id: 'round-001',
    roundNumber: 3,
    status: 3, // Completed
    compensationCycleStartDate: '2025-09-01T00:00:00Z',
    compensationCycleEndDate: '2025-09-30T23:59:59Z',
    startDate: '2025-09-01T00:00:00Z',
    endDate: '2025-09-30T23:59:59Z',
    hasIncompletePayouts: true,
    totalStableAmount: '12500.00',
    totalRecognitionAmount: '8750.50',
    recipientCount: 15
  },
  {
    id: 'round-002',
    roundNumber: 2,
    status: 3, // Completed
    compensationCycleStartDate: '2025-08-01T00:00:00Z',
    compensationCycleEndDate: '2025-08-31T23:59:59Z',
    startDate: '2025-08-01T00:00:00Z',
    endDate: '2025-08-31T23:59:59Z',
    hasIncompletePayouts: true,
    totalStableAmount: '9800.00',
    totalRecognitionAmount: '5200.00',
    recipientCount: 12
  },
  {
    id: 'round-003',
    roundNumber: 1,
    status: 3, // Completed
    compensationCycleStartDate: '2025-07-01T00:00:00Z',
    compensationCycleEndDate: '2025-07-31T23:59:59Z',
    startDate: '2025-07-01T00:00:00Z',
    endDate: '2025-07-31T23:59:59Z',
    hasIncompletePayouts: false,
    totalStableAmount: '8000.00',
    totalRecognitionAmount: '4500.00',
    recipientCount: 10
  }
];

// Mock Recipients for Round 1
export const mockRecipients: PayoutRecipient[] = [
  {
    id: 'recipient-001',
    userId: 'user-001',
    walletAddress: '0xRecipient1234567890123456789012345678901',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '1250.50',
    amountBaseUnits: '1250500000',
    status: 'pending'
  },
  {
    id: 'recipient-002',
    userId: 'user-002',
    walletAddress: '0xRecipient2234567890123456789012345678902',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '980.00',
    amountBaseUnits: '980000000',
    status: 'pending'
  },
  {
    id: 'recipient-003',
    userId: 'user-003',
    walletAddress: '0xRecipient3234567890123456789012345678903',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '2100.00',
    amountBaseUnits: '2100000000',
    status: 'pending'
  },
  {
    id: 'recipient-004',
    userId: 'user-004',
    walletAddress: '0xRecipient4234567890123456789012345678904',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '750.25',
    amountBaseUnits: '750250000',
    status: 'pending'
  },
  {
    id: 'recipient-005',
    userId: 'user-005',
    walletAddress: '0xRecipient5234567890123456789012345678905',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '1500.00',
    amountBaseUnits: '1500000000',
    status: 'pending'
  },
  {
    id: 'recipient-006',
    userId: 'user-006',
    walletAddress: '0xRecipient6234567890123456789012345678906',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '890.75',
    amountBaseUnits: '890750000',
    status: 'pending'
  },
  {
    id: 'recipient-007',
    userId: 'user-007',
    walletAddress: '0xRecipient7234567890123456789012345678907',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '1325.00',
    amountBaseUnits: '1325000000',
    status: 'pending'
  },
  {
    id: 'recipient-008',
    userId: 'user-008',
    walletAddress: '0xRecipient8234567890123456789012345678908',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '675.50',
    amountBaseUnits: '675500000',
    status: 'pending'
  },
  {
    id: 'recipient-009',
    userId: 'user-009',
    walletAddress: '0xRecipient9234567890123456789012345678909',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '1800.00',
    amountBaseUnits: '1800000000',
    status: 'pending'
  },
  {
    id: 'recipient-010',
    userId: 'user-010',
    walletAddress: '0xRecipient0234567890123456789012345678910',
    tokenType: 'stablecoin',
    tokenAddress: mockStablecoinInfo.address,
    tokenDecimals: 6,
    amountHuman: '1228.00',
    amountBaseUnits: '1228000000',
    status: 'pending'
  },
  // Recognition token recipients
  {
    id: 'recipient-011',
    userId: 'user-001',
    walletAddress: '0xRecipient1234567890123456789012345678901',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '850.50',
    amountBaseUnits: '850500000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-012',
    userId: 'user-002',
    walletAddress: '0xRecipient2234567890123456789012345678902',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '720.00',
    amountBaseUnits: '720000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-013',
    userId: 'user-003',
    walletAddress: '0xRecipient3234567890123456789012345678903',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '1500.00',
    amountBaseUnits: '1500000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-014',
    userId: 'user-004',
    walletAddress: '0xRecipient4234567890123456789012345678904',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '600.00',
    amountBaseUnits: '600000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-015',
    userId: 'user-005',
    walletAddress: '0xRecipient5234567890123456789012345678905',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '1080.00',
    amountBaseUnits: '1080000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-016',
    userId: 'user-006',
    walletAddress: '0xRecipient6234567890123456789012345678906',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '450.00',
    amountBaseUnits: '450000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-017',
    userId: 'user-007',
    walletAddress: '0xRecipient7234567890123456789012345678907',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '900.00',
    amountBaseUnits: '900000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-018',
    userId: 'user-008',
    walletAddress: '0xRecipient8234567890123456789012345678908',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '650.00',
    amountBaseUnits: '650000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-019',
    userId: 'user-009',
    walletAddress: '0xRecipient9234567890123456789012345678909',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '1200.00',
    amountBaseUnits: '1200000000000000000000',
    status: 'pending'
  },
  {
    id: 'recipient-020',
    userId: 'user-010',
    walletAddress: '0xRecipient0234567890123456789012345678910',
    tokenType: 'recognition',
    tokenAddress: mockRecognitionTokenInfo.address,
    tokenDecimals: 18,
    amountHuman: '800.00',
    amountBaseUnits: '800000000000000000000',
    status: 'pending'
  }
];

// Mock Transaction Proposals
export const mockTransactionProposals: SafeTransactionProposal[] = [
  {
    id: 'tx-proposal-001',
    payoutId: 'payout-001',
    payoutType: 'round',
    tokenType: 'stablecoin',
    partIndex: 1,
    partCount: 2,
    attempt: 1,
    safeTxHash: '0xSafeTx1234567890123456789012345678901234567890',
    status: 'executed',
    proposedAt: '2025-10-05T10:00:00Z',
    executedAt: '2025-10-05T14:30:00Z',
    payloadJson: [],
    explorerUrl: 'https://sepolia.arbiscan.io/tx/0xSafeTx1234567890123456789012345678901234567890'
  },
  {
    id: 'tx-proposal-002',
    payoutId: 'payout-001',
    payoutType: 'round',
    tokenType: 'stablecoin',
    partIndex: 2,
    partCount: 2,
    attempt: 1,
    safeTxHash: '0xSafeTx2234567890123456789012345678901234567890',
    status: 'proposed',
    proposedAt: '2025-10-05T15:00:00Z',
    payloadJson: []
  },
  {
    id: 'tx-proposal-003',
    payoutId: 'payout-001',
    payoutType: 'round',
    tokenType: 'recognition',
    partIndex: 1,
    partCount: 1,
    attempt: 1,
    status: 'proposed',
    proposedAt: '2025-10-05T16:00:00Z',
    payloadJson: []
  }
];

// Mock Payouts
export const mockPayouts: Payout[] = [
  {
    id: 'payout-001',
    organizationId: 'mock-org-1',
    roundId: 'round-001',
    status: 'partial',
    totalStablePayout: '12500.00',
    totalRecognitionPayout: '8750.50',
    createdAt: '2025-10-05T09:00:00Z',
    updatedAt: '2025-10-05T15:30:00Z',
    recipients: mockRecipients,
    txProposals: mockTransactionProposals
  },
  {
    id: 'payout-002',
    organizationId: 'mock-org-1',
    roundId: 'round-002',
    status: 'draft',
    totalStablePayout: '9800.00',
    totalRecognitionPayout: '5200.00',
    createdAt: '2025-10-03T12:00:00Z',
    updatedAt: '2025-10-03T12:00:00Z',
    recipients: [],
    txProposals: []
  }
];
