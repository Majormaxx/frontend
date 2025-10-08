/**
 * Payout Rounds Component
 * Lists incomplete rounds that need payouts with preview and action buttons
 */

import React, { useState } from 'react';
import { Button, Card, Dialog, Tooltip, Alert, Spinner } from '@/components/ui';
import { useGetPayoutRoundsQuery } from '@/services/PayoutApiService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PayoutRound } from '@/@types/safe-payouts';
import RoundStatusTag from '@/components/collabberry/custom-components/CustomFields/RoundStatusTag';
import { HiInformationCircle, HiEye, HiCash, HiCurrencyDollar } from 'react-icons/hi';
import { FiAlertTriangle } from 'react-icons/fi';
import PayoutPreview from './PayoutPreview';
import CustomTableWithSorting from '@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting';
import { ColumnDef } from '@tanstack/react-table';

const PayoutRounds: React.FC = () => {
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const organization = useSelector((state: RootState) => state.auth.org);
  
  const {
    data: roundsData,
    isLoading,
    error,
    refetch
  } = useGetPayoutRoundsQuery(
    { orgId: organization?.id || '' },
    { skip: !organization?.id }
  );

  const handlePreviewRound = (roundId: string) => {
    setSelectedRoundId(roundId);
    setIsPreviewDialogOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewDialogOpen(false);
    setSelectedRoundId(null);
  };

  const columns: ColumnDef<PayoutRound>[] = [
    {
      header: 'Round',
      accessorKey: 'roundNumber',
      cell: (props) => {
        const value = props.getValue() as number;
        return <span className="font-medium">{`Round ${value}`}</span>;
      }
    },
    {
      header: 'Compensation Period',
      accessorKey: 'compensationCycleStartDate',
      cell: (props) => {
        const row = props.row.original;
        const startDate = new Date(row.compensationCycleStartDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        });
        const endDate = new Date(row.compensationCycleEndDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        });
        return <span className="text-sm">{`${startDate} - ${endDate}`}</span>;
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (props) => {
        const value = props.getValue() as number;
        return <RoundStatusTag roundStatus={value} />;
      }
    },
    {
      header: 'Recipients',
      accessorKey: 'recipientCount',
      cell: (props) => {
        const value = props.getValue() as number;
        return (
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{value || 0}</span>
            <span className="text-xs text-gray-500">recipients</span>
          </div>
        );
      }
    },
    {
      header: 'Stable Amount',
      accessorKey: 'totalStableAmount',
      cell: (props) => {
        const value = props.getValue() as string;
        return value ? (
          <div className="flex items-center gap-1">
            <HiCurrencyDollar className="text-green-500" />
            <span className="text-sm font-medium">{value}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        );
      }
    },
    {
      header: 'Recognition Amount',
      accessorKey: 'totalRecognitionAmount',
      cell: (props) => {
        const value = props.getValue() as string;
        return value ? (
          <div className="flex items-center gap-1">
            <HiCash className="text-purple-500" />
            <span className="text-sm font-medium">{value}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        );
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: (props) => {
        const round = props.row.original;
        return (
          <div className="flex gap-2">
            <Tooltip title="Preview Payout">
              <Button
                size="sm"
                shape="circle"
                icon={<HiEye />}
                variant="twoTone"
                color="berrylavender"
                onClick={() => handlePreviewRound(round.id)}
              />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
        <span className="ml-2">Loading rounds...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="danger" showIcon>
        <div className="flex items-center justify-between">
          <div>
            <h4>Error Loading Rounds</h4>
            <p>Failed to load payout rounds. Please try again.</p>
          </div>
          <Button size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  const rounds = roundsData?.rounds || [];

  // Check if Safe configuration is complete
  const isSafeConfigured = organization?.safeAddress && 
                          organization?.stablecoinAddress && 
                          organization?.recognitionTokenAddress;

  if (!isSafeConfigured) {
    return (
      <Alert type="warning" showIcon>
        <div className="flex items-center gap-2">
          <FiAlertTriangle />
          <div>
            <h4>Configuration Required</h4>
            <p>Please configure your Safe address and token settings in the Payout Settings tab before creating payouts.</p>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="mb-2">Payout Rounds</h3>
        <p className="text-gray-600">
          Manage payouts for completed rounds. Preview recipient details and create Safe multisig transactions.
        </p>
      </div>

      {rounds.length === 0 ? (
        <Card className="p-8 text-center">
          <HiInformationCircle className="mx-auto mb-4 text-4xl text-gray-400" />
          <h4 className="mb-2 text-gray-600">No Rounds Available</h4>
          <p className="text-sm text-gray-500">
            There are no completed rounds that require payouts at this time.
          </p>
        </Card>
      ) : (
        <Card>
          <CustomTableWithSorting
            data={rounds}
            columns={columns}
            initialSort={[{ id: 'roundNumber', desc: true }]}
          />
        </Card>
      )}

      {/* Preview Dialog */}
      {isPreviewDialogOpen && selectedRoundId && (
        <Dialog
          isOpen={isPreviewDialogOpen}
          onClose={handleClosePreview}
          width={1000}
        >
          <PayoutPreview
            roundId={selectedRoundId}
            onClose={handleClosePreview}
          />
        </Dialog>
      )}
    </div>
  );
};

export default PayoutRounds;
