/**
 * Payout API Service
 * RTK Query endpoints for Safe multisig payout functionality
 */

import RtkQueryService from './RtkQueryService';
import {
  GetPayoutRoundsResponse,
  GetPayoutPreviewRequest,
  GetPayoutPreviewResponse,
  ProposePayoutRequest,
  ProposePayoutResponse,
  GetPayoutStatusRequest,
  GetPayoutStatusResponse,
  ManualPayoutRequest,
  PayoutExportData
} from '@/@types/safe-payouts';

export const PayoutApiService = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get rounds that have incomplete payouts
     */
    getPayoutRounds: builder.query<GetPayoutRoundsResponse, { orgId: string }>({
      query: ({ orgId }) => ({
        url: `/payouts/rounds`,
        method: 'GET',
        params: { orgId }
      }),
      providesTags: ['PayoutRounds']
    }),

    /**
     * Preview payout for a specific round
     */
    getPayoutPreview: builder.query<GetPayoutPreviewResponse, GetPayoutPreviewRequest>({
      query: ({ roundId }) => ({
        url: `/payouts/preview`,
        method: 'GET',
        params: { roundId }
      }),
      providesTags: (result, error, { roundId }) => [
        { type: 'PayoutPreview', id: roundId }
      ]
    }),

    /**
     * Propose a payout transaction to Safe
     */
    proposePayout: builder.mutation<ProposePayoutResponse, ProposePayoutRequest>({
      query: (data) => ({
        url: `/payouts/propose`,
        method: 'POST',
        data
      }),
      invalidatesTags: (result, error, { roundId }) => [
        { type: 'PayoutStatus', id: roundId },
        'PayoutRounds'
      ]
    }),

    /**
     * Get payout status for a round
     */
    getPayoutStatus: builder.query<GetPayoutStatusResponse, GetPayoutStatusRequest>({
      query: ({ roundId }) => ({
        url: `/payouts/status`,
        method: 'GET',
        params: { roundId }
      }),
      providesTags: (result, error, { roundId }) => [
        { type: 'PayoutStatus', id: roundId }
      ]
    }),

    /**
     * Create manual payout
     */
    createManualPayout: builder.mutation<ProposePayoutResponse, ManualPayoutRequest>({
      query: (data) => ({
        url: `/payouts/manual`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['PayoutRounds']
    }),

    /**
     * Export payout data as CSV
     */
    exportPayoutData: builder.query<PayoutExportData[], { payoutId: string }>({
      query: ({ payoutId }) => ({
        url: `/payouts/export/${payoutId}`,
        method: 'GET'
      })
    }),

    /**
     * Retry failed payout transaction
     */
    retryPayoutTransaction: builder.mutation<ProposePayoutResponse, { txProposalId: string }>({
      query: ({ txProposalId }) => ({
        url: `/payouts/retry`,
        method: 'POST',
        data: { txProposalId }
      }),
      invalidatesTags: (result, error, { txProposalId }) => [
        'PayoutRounds',
        { type: 'PayoutStatus', id: 'LIST' }
      ]
    }),

    /**
     * Get all payouts for organization (for history/status page)
     */
    getOrganizationPayouts: builder.query<GetPayoutStatusResponse, { orgId: string; limit?: number; offset?: number }>({
      query: ({ orgId, limit = 50, offset = 0 }) => ({
        url: `/payouts/organization/${orgId}`,
        method: 'GET',
        params: { limit, offset }
      }),
      providesTags: ['PayoutHistory']
    }),

    /**
     * Cancel pending payout transaction
     */
    cancelPayoutTransaction: builder.mutation<{ success: boolean }, { txProposalId: string }>({
      query: ({ txProposalId }) => ({
        url: `/payouts/cancel`,
        method: 'POST',
        data: { txProposalId }
      }),
      invalidatesTags: ['PayoutRounds', 'PayoutHistory']
    })
  }),
  overrideExisting: false
});

// Export hooks for use in components
export const {
  useGetPayoutRoundsQuery,
  useGetPayoutPreviewQuery,
  useProposePayoutMutation,
  useGetPayoutStatusQuery,
  useCreateManualPayoutMutation,
  useExportPayoutDataQuery,
  useRetryPayoutTransactionMutation,
  useGetOrganizationPayoutsQuery,
  useCancelPayoutTransactionMutation
} = PayoutApiService;

// Export endpoints for use in other services
export const {
  getPayoutRounds,
  getPayoutPreview,
  proposePayout,
  getPayoutStatus,
  createManualPayout,
  exportPayoutData,
  retryPayoutTransaction,
  getOrganizationPayouts,
  cancelPayoutTransaction
} = PayoutApiService.endpoints;
