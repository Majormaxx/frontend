/**
 * Payout Status Component
 * Track and manage Safe transaction proposals with status updates and retry functionality
 */

import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Alert, 
  Spinner, 
  Badge,
  Tooltip,
  Dialog
} from '@/components/ui';
import { 
  useGetOrganizationPayoutsQuery,
  useRetryPayoutTransactionMutation,
  useCancelPayoutTransactionMutation,
  useExportPayoutDataQuery
} from '@/services/PayoutApiService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Payout, SafeTransactionProposal, TransactionStatus } from '@/@types/safe-payouts';
import { 
  HiExternalLink, 
  HiRefresh, 
  HiX, 
  HiDownload,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import CustomTableWithSorting from '@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting';
import { ColumnDef } from '@tanstack/react-table';
import { useHandleError } from '@/services/HandleError';

const PayoutStatus: React.FC = () => {
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const organization = useSelector((state: RootState) => state.auth.org);
  const handleError = useHandleError();

  const {
    data: payoutsData,
    isLoading,
    error,
    refetch
  } = useGetOrganizationPayoutsQuery(
    { orgId: organization?.id || '' },
    { skip: !organization?.id, pollingInterval: 30000 } // Poll every 30 seconds
  );

  const [retryTransaction] = useRetryPayoutTransactionMutation();
  const [cancelTransaction] = useCancelPayoutTransactionMutation();

  const {
    data: exportData,
    isLoading: isExporting
  } = useExportPayoutDataQuery(
    { payoutId: selectedPayoutId || '' },
    { skip: !selectedPayoutId }
  );

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'proposed':
        return <HiClock className="text-yellow-500" />;
      case 'executed':
        return <HiCheckCircle className="text-green-500" />;
      case 'failed':
        return <HiXCircle className="text-red-500" />;
      case 'canceled':
        return <HiX className="text-gray-500" />;
      default:
        return <HiExclamationCircle className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'proposed':
        return 'amber';
      case 'executed':
        return 'emerald';
      case 'failed':
        return 'red';
      case 'canceled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const handleRetryTransaction = async (txProposalId: string) => {
    try {
      await retryTransaction({ txProposalId }).unwrap();
      refetch();
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleCancelTransaction = async (txProposalId: string) => {
    try {
      await cancelTransaction({ txProposalId }).unwrap();
      refetch();
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleExportPayout = (payoutId: string) => {
    setSelectedPayoutId(payoutId);
    setIsExportDialogOpen(true);
  };

  const downloadCSV = () => {
    if (!exportData) return;

    const csvContent = [
      // CSV Headers
      'Round ID,Payout Type,Token Type,Part Index,Part Count,Attempt,Safe Tx Hash,Status,Proposed At,Executed At,Explorer URL,Wallet Address,Amount Human,Amount Base Units,Recipient Status,Error',
      // CSV Data
      ...exportData.map(row => [
        row.roundId,
        row.payoutType,
        row.tokenType,
        row.partIndex,
        row.partCount,
        row.attempt,
        row.safeTxHash || '',
        row.status,
        row.proposedAt,
        row.executedAt || '',
        row.explorerUrl || '',
        row.walletAddress,
        row.amountHuman,
        row.amountBaseUnits,
        row.recipientStatus,
        row.error || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payout-${selectedPayoutId}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setIsExportDialogOpen(false);
    setSelectedPayoutId(null);
  };

  const columns: ColumnDef<Payout>[] = [
    {
      header: 'Round',
      accessorKey: 'roundId',
      cell: (props) => {
        const roundId = props.getValue() as string;
        return <span className="font-mono text-sm">{roundId.slice(0, 8)}...</span>;
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (props) => {
        const status = props.getValue() as string;
        return (
          <Badge 
            className={`bg-${getStatusColor(status as TransactionStatus)}-100 text-${getStatusColor(status as TransactionStatus)}-700`}
          >
            {status.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      header: 'Transactions',
      id: 'transactions',
      cell: (props) => {
        const payout = props.row.original;
        const totalTx = payout.txProposals.length;
        const executedTx = payout.txProposals.filter(tx => tx.status === 'executed').length;
        const failedTx = payout.txProposals.filter(tx => tx.status === 'failed').length;
        
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{executedTx}/{totalTx}</span>
            {failedTx > 0 && (
              <Badge className="bg-red-100 text-red-700 text-xs">
                {failedTx} failed
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      header: 'Total Amounts',
      id: 'amounts',
      cell: (props) => {
        const payout = props.row.original;
        return (
          <div className="text-sm">
            <div>Stable: {payout.totalStablePayout}</div>
            <div>Recognition: {payout.totalRecognitionPayout}</div>
          </div>
        );
      }
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: (props) => {
        const date = new Date(props.getValue() as string);
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: (props) => {
        const payout = props.row.original;
        const hasFailedTx = payout.txProposals.some(tx => tx.status === 'failed');
        const hasPendingTx = payout.txProposals.some(tx => tx.status === 'proposed');
        
        return (
          <div className="flex gap-1">
            <Tooltip title="Export CSV">
              <Button
                size="sm"
                shape="circle"
                icon={<HiDownload />}
                variant="twoTone"
                onClick={() => handleExportPayout(payout.id)}
              />
            </Tooltip>
            
            {hasFailedTx && (
              <Tooltip title="Retry Failed">
                <Button
                  size="sm"
                  shape="circle"
                  icon={<HiRefresh />}
                  variant="twoTone"
                  color="amber"
                  onClick={() => {
                    const failedTx = payout.txProposals.find(tx => tx.status === 'failed');
                    if (failedTx) handleRetryTransaction(failedTx.id);
                  }}
                />
              </Tooltip>
            )}
            
            {hasPendingTx && (
              <Tooltip title="Cancel Pending">
                <Button
                  size="sm"
                  shape="circle"
                  icon={<HiX />}
                  variant="twoTone"
                  color="red"
                  onClick={() => {
                    const pendingTx = payout.txProposals.find(tx => tx.status === 'proposed');
                    if (pendingTx) handleCancelTransaction(pendingTx.id);
                  }}
                />
              </Tooltip>
            )}
            
            {payout.txProposals.map(tx => tx.explorerUrl).filter(Boolean).length > 0 && (
              <Tooltip title="View on Explorer">
                <Button
                  size="sm"
                  shape="circle"
                  icon={<HiExternalLink />}
                  variant="twoTone"
                  onClick={() => {
                    const txWithExplorer = payout.txProposals.find(tx => tx.explorerUrl);
                    if (txWithExplorer?.explorerUrl) {
                      window.open(txWithExplorer.explorerUrl, '_blank');
                    }
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
        <span className="ml-2">Loading payout history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="danger" showIcon>
        <div className="flex items-center justify-between">
          <div>
            <h4>Error Loading Payouts</h4>
            <p>Failed to load payout history. Please try again.</p>
          </div>
          <Button size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  const payouts = payoutsData?.payouts || [];

  return (
    <div>
      <div className="mb-6">
        <h3 className="mb-2">Payout Status & History</h3>
        <p className="text-gray-600">
          Track the status of Safe multisig transactions and manage failed or pending payouts.
        </p>
      </div>

      {payouts.length === 0 ? (
        <Card className="p-8 text-center">
          <HiExclamationCircle className="mx-auto mb-4 text-4xl text-gray-400" />
          <h4 className="mb-2 text-gray-600">No Payouts Found</h4>
          <p className="text-sm text-gray-500">
            No payout transactions have been created yet.
          </p>
        </Card>
      ) : (
        <Card>
          <CustomTableWithSorting
            data={payouts}
            columns={columns}
            initialSort={[{ id: 'createdAt', desc: true }]}
          />
        </Card>
      )}

      {/* Export Dialog */}
      <Dialog
        isOpen={isExportDialogOpen}
        onClose={() => {
          setIsExportDialogOpen(false);
          setSelectedPayoutId(null);
        }}
        width={400}
      >
        <div className="p-6">
          <h3 className="mb-4">Export Payout Data</h3>
          <p className="mb-6 text-gray-600">
            Download detailed payout data including all transactions and recipient information.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="plain"
              onClick={() => {
                setIsExportDialogOpen(false);
                setSelectedPayoutId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="berrylavender"
              loading={isExporting}
              onClick={downloadCSV}
              icon={<HiDownload />}
            >
              Download CSV
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PayoutStatus;
