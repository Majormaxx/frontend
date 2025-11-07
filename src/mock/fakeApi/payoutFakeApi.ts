/**
 * Mock API endpoints for Safe Multisig Payout System (Module II)
 */

import { Server, Response } from 'miragejs';
import {
  mockPayoutRounds,
  mockRecipients,
  mockPayouts,
  mockSafeInfo,
  mockStablecoinInfo,
  mockRecognitionTokenInfo
} from '../data/payoutData';
import {
  PayoutPreview,
  ProposePayoutRequest,
  ProposePayoutResponse
} from '@/@types/safe-payouts';

export default function payoutFakeApi(server: Server, apiPrefix: string) {
  /**
   * GET /payouts/rounds
   * Get rounds that have incomplete payouts
   */
  server.get(`${apiPrefix}/payouts/rounds`, (schema, request) => {
    const { orgId } = request.queryParams;

    console.log('Mock API: getPayoutRounds called with orgId:', orgId);

    // Filter rounds with incomplete payouts
    const rounds = mockPayoutRounds.filter(round => round.hasIncompletePayouts);

    return {
      rounds
    };
  });

  /**
   * GET /payouts/preview
   * Preview payout for a specific round
   */
  server.get(`${apiPrefix}/payouts/preview`, (schema, request) => {
    const { roundId } = request.queryParams;

    console.log('Mock API: getPayoutPreview called with roundId:', roundId);

    // Filter recipients for this round (in real app would be based on round data)
    const stablecoinRecipients = mockRecipients.filter(r => r.tokenType === 'stablecoin');
    const recognitionRecipients = mockRecipients.filter(r => r.tokenType === 'recognition');

    // Calculate totals
    const stablecoinTotal = stablecoinRecipients.reduce(
      (sum, r) => sum + parseFloat(r.amountHuman),
      0
    );
    const recognitionTotal = recognitionRecipients.reduce(
      (sum, r) => sum + parseFloat(r.amountHuman),
      0
    );

    // Calculate chunking (max 50 recipients per chunk for MultiSend)
    const maxRecipientsPerChunk = 50;
    const stablecoinChunks = Math.ceil(stablecoinRecipients.length / maxRecipientsPerChunk);
    const recognitionChunks = Math.ceil(recognitionRecipients.length / maxRecipientsPerChunk);

    // Generate warnings
    const warnings: string[] = [];

    if (stablecoinTotal > 10000) {
      warnings.push('Large stablecoin payout detected. Please ensure Safe has sufficient balance.');
    }

    if (stablecoinChunks > 1) {
      warnings.push(
        `Stablecoin payout will be split into ${stablecoinChunks} transactions due to recipient count.`
      );
    }

    if (recognitionChunks > 1) {
      warnings.push(
        `Recognition payout will be split into ${recognitionChunks} transactions due to recipient count.`
      );
    }

    const preview: PayoutPreview = {
      roundId,
      recipients: mockRecipients,
      totals: {
        stablecoin: {
          amountHuman: stablecoinTotal.toFixed(2),
          amountBaseUnits: (stablecoinTotal * 1000000).toString(),
          tokenInfo: mockStablecoinInfo
        },
        recognition: {
          amountHuman: recognitionTotal.toFixed(2),
          amountBaseUnits: (recognitionTotal * 1e18).toString(),
          tokenInfo: mockRecognitionTokenInfo
        }
      },
      warnings,
      chunkPlan: {
        stablecoin: {
          totalChunks: stablecoinChunks,
          recipientsPerChunk: maxRecipientsPerChunk
        },
        recognition: {
          totalChunks: recognitionChunks,
          recipientsPerChunk: maxRecipientsPerChunk
        }
      },
      safeInfo: mockSafeInfo
    };

    return {
      preview
    };
  });

  /**
   * POST /payouts/propose
   * Propose a payout transaction to Safe
   */
  server.post(`${apiPrefix}/payouts/propose`, (schema, { requestBody }) => {
    const { roundId, tokenType }: ProposePayoutRequest = JSON.parse(requestBody);

    console.log('Mock API: proposePayout called with:', { roundId, tokenType });

    // Simulate creating a Safe transaction proposal
    const payoutId = `payout-${Date.now()}`;
    const txProposalId = `tx-proposal-${Date.now()}`;
    const safeTxHash = `0xSafeTx${Math.random().toString(36).substring(2)}`;
    const safeUrl = `https://app.safe.global/transactions/queue?safe=arb-sep:${mockSafeInfo.address}`;

    const response: ProposePayoutResponse = {
      payoutId,
      txProposalId,
      safeTxHash,
      safeUrl
    };

    return response;
  });

  /**
   * GET /payouts/status
   * Get payout status for a round
   */
  server.get(`${apiPrefix}/payouts/status`, (schema, request) => {
    const { roundId } = request.queryParams;

    console.log('Mock API: getPayoutStatus called with roundId:', roundId);

    // Return payouts for this round
    const payouts = mockPayouts.filter(p => p.roundId === roundId);

    return {
      payouts
    };
  });

  /**
   * GET /payouts/organization/:orgId
   * Get all payouts for organization (for history/status page)
   */
  server.get(`${apiPrefix}/payouts/organization/:orgId`, (schema, request) => {
    const { orgId } = request.params;
    const { limit, offset } = request.queryParams;

    console.log('Mock API: getOrganizationPayouts called with:', { orgId, limit, offset });

    // Return all payouts for the organization
    const payouts = mockPayouts.filter(p => p.organizationId === orgId);

    return {
      payouts
    };
  });

  /**
   * POST /payouts/manual
   * Create manual payout
   */
  server.post(`${apiPrefix}/payouts/manual`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody);

    console.log('Mock API: createManualPayout called with:', data);

    const payoutId = `manual-payout-${Date.now()}`;
    const txProposalId = `tx-proposal-${Date.now()}`;
    const safeTxHash = `0xSafeTx${Math.random().toString(36).substring(2)}`;
    const safeUrl = `https://app.safe.global/transactions/queue?safe=arb-sep:${mockSafeInfo.address}`;

    const response: ProposePayoutResponse = {
      payoutId,
      txProposalId,
      safeTxHash,
      safeUrl
    };

    return response;
  });

  /**
   * GET /payouts/export/:payoutId
   * Export payout data as CSV
   */
  server.get(`${apiPrefix}/payouts/export/:payoutId`, (schema, request) => {
    const { payoutId } = request.params;

    console.log('Mock API: exportPayoutData called with payoutId:', payoutId);

    const payout = mockPayouts.find(p => p.id === payoutId);

    if (!payout) {
      return new Response(
        404,
        { some: 'header' },
        { message: 'Payout not found' }
      );
    }

    // Generate export data
    const exportData = payout.recipients.map(recipient => ({
      roundId: payout.roundId || '',
      payoutType: 'round' as const,
      tokenType: recipient.tokenType,
      partIndex: recipient.partIndex || 1,
      partCount: recipient.partCount || 1,
      attempt: recipient.attempt || 1,
      safeTxHash: recipient.txProposalId || '',
      status: recipient.status === 'executed' ? 'executed' as const : 'proposed' as const,
      proposedAt: payout.createdAt,
      executedAt: recipient.status === 'executed' ? payout.updatedAt : undefined,
      explorerUrl: recipient.status === 'executed'
        ? `https://sepolia.arbiscan.io/tx/${recipient.txProposalId}`
        : undefined,
      walletAddress: recipient.walletAddress,
      amountHuman: recipient.amountHuman,
      amountBaseUnits: recipient.amountBaseUnits,
      recipientStatus: recipient.status,
      error: recipient.error
    }));

    return exportData;
  });

  /**
   * POST /payouts/retry
   * Retry failed payout transaction
   */
  server.post(`${apiPrefix}/payouts/retry`, (schema, { requestBody }) => {
    const { txProposalId } = JSON.parse(requestBody);

    console.log('Mock API: retryPayoutTransaction called with txProposalId:', txProposalId);

    const payoutId = `payout-retry-${Date.now()}`;
    const newTxProposalId = `tx-proposal-retry-${Date.now()}`;
    const safeTxHash = `0xSafeTx${Math.random().toString(36).substring(2)}`;
    const safeUrl = `https://app.safe.global/transactions/queue?safe=arb-sep:${mockSafeInfo.address}`;

    const response: ProposePayoutResponse = {
      payoutId,
      txProposalId: newTxProposalId,
      safeTxHash,
      safeUrl
    };

    return response;
  });

  /**
   * POST /payouts/cancel
   * Cancel pending payout transaction
   */
  server.post(`${apiPrefix}/payouts/cancel`, (schema, { requestBody }) => {
    const { txProposalId } = JSON.parse(requestBody);

    console.log('Mock API: cancelPayoutTransaction called with txProposalId:', txProposalId);

    return {
      success: true
    };
  });
}
