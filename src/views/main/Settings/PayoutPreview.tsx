/**
 * Payout Preview Component
 * Preview payout recipients, amounts, totals, and validation warnings before proposing transactions
 */

import React, { useState } from 'react';
import {
  Button,
  Card,
  Alert,
  Spinner,
  Tabs,
  Badge
} from '@/components/ui';
import { 
  useGetPayoutPreviewQuery, 
  useProposePayoutMutation 
} from '@/services/PayoutApiService';
import { PayoutRecipient, TokenType } from '@/@types/safe-payouts';
import { HiCurrencyDollar, HiCash, HiExternalLink, HiExclamation } from 'react-icons/hi';
import { FiUsers, FiLayers } from 'react-icons/fi';
import CustomTableWithSorting from '@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting';
import { ColumnDef } from '@tanstack/react-table';
import { useHandleError } from '@/services/HandleError';
import SuccessDialog from '@/components/collabberry/custom-components/TransactionSuccessDialog';
import ErrorDialog from '@/components/collabberry/custom-components/TransactionErrorDialog';
import LoadingDialog from '@/components/collabberry/custom-components/LoadingDialog';

const { TabNav, TabList, TabContent } = Tabs;

interface PayoutPreviewProps {
  roundId: string;
  onClose: () => void;
}

const PayoutPreview: React.FC<PayoutPreviewProps> = ({ roundId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stablecoin' | 'recognition'>('stablecoin');
  const [isProposing, setIsProposing] = useState(false);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [safeUrl, setSafeUrl] = useState('');

  const handleError = useHandleError();

  const {
    data: previewData,
    isLoading,
    error
  } = useGetPayoutPreviewQuery({ roundId });

  const [proposePayout] = useProposePayoutMutation();

  const handleProposePayout = async (tokenType: TokenType) => {
    setIsProposing(true);
    try {
      const result = await proposePayout({ roundId, tokenType }).unwrap();
      setSafeUrl(result.safeUrl);
      setSuccessDialogVisible(true);
    } catch (error: any) {
      setErrorMessage(error?.data?.message || 'Failed to propose payout');
      setErrorDialogVisible(true);
    } finally {
      setIsProposing(false);
    }
  };

  const recipientColumns: ColumnDef<PayoutRecipient>[] = [
    {
      header: 'Recipient',
      accessorKey: 'walletAddress',
      cell: (props) => {
        const address = props.getValue() as string;
        return (
          <div className="font-mono text-sm">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
        );
      }
    },
    {
      header: 'Amount',
      accessorKey: 'amountHuman',
      cell: (props) => {
        const amount = props.getValue() as string;
        const recipient = props.row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{amount}</span>
            <Badge size="sm" className="text-xs">
              {recipient.tokenType === 'stablecoin' ? 'STABLE' : 'TP'}
            </Badge>
          </div>
        );
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" />
          <span className="ml-2">Loading preview...</span>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="p-6">
        <Alert type="danger" showIcon>
          <h4>Error Loading Preview</h4>
          <p>Failed to load payout preview. Please try again.</p>
        </Alert>
      </div>
    );
  }

  const { preview } = previewData;
  const stablecoinRecipients = preview.recipients.filter(r => r.tokenType === 'stablecoin');
  const recognitionRecipients = preview.recipients.filter(r => r.tokenType === 'recognition');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="mb-2">Payout Preview</h3>
        <p className="text-gray-600">
          Review recipient details and amounts before proposing transactions to Safe.
        </p>
      </div>

      {/* Warnings */}
      {preview.warnings.length > 0 && (
        <Alert type="warning" showIcon className="mb-6">
          <div>
            <h4 className="flex items-center gap-2">
              <HiExclamation />
              Validation Warnings
            </h4>
            <ul className="mt-2 list-disc list-inside">
              {preview.warnings.map((warning, index) => (
                <li key={index} className="text-sm">{warning}</li>
              ))}
            </ul>
          </div>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="flex items-center gap-2 text-green-600">
                <HiCurrencyDollar />
                Stablecoin Payout
              </h4>
              <p className="text-2xl font-bold mt-1">
                {preview.totals.stablecoin.amountHuman} {preview.totals.stablecoin.tokenInfo.symbol}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FiUsers className="w-4 h-4" />
                {stablecoinRecipients.length} recipients
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FiLayers className="w-3 h-3" />
                {preview.chunkPlan.stablecoin.totalChunks} chunks
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="flex items-center gap-2 text-purple-600">
                <HiCash />
                Recognition Payout
              </h4>
              <p className="text-2xl font-bold mt-1">
                {preview.totals.recognition.amountHuman} {preview.totals.recognition.tokenInfo.symbol}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FiUsers className="w-4 h-4" />
                {recognitionRecipients.length} recipients
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FiLayers className="w-3 h-3" />
                {preview.chunkPlan.recognition.totalChunks} chunks
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recipients Table */}
      <Card className="mb-6">
        <Tabs value={activeTab} onChange={(val) => setActiveTab(val as 'stablecoin' | 'recognition')}>
          <TabList>
            <TabNav value="stablecoin">
              Stablecoin Recipients ({stablecoinRecipients.length})
            </TabNav>
            <TabNav value="recognition">
              Recognition Recipients ({recognitionRecipients.length})
            </TabNav>
          </TabList>
          <div className="p-4">
            <TabContent value="stablecoin">
              {stablecoinRecipients.length > 0 ? (
                <CustomTableWithSorting
                  data={stablecoinRecipients}
                  columns={recipientColumns}
                  initialSort={[{ id: 'amountHuman', desc: true }]}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No stablecoin recipients for this round
                </div>
              )}
            </TabContent>
            <TabContent value="recognition">
              {recognitionRecipients.length > 0 ? (
                <CustomTableWithSorting
                  data={recognitionRecipients}
                  columns={recipientColumns}
                  initialSort={[{ id: 'amountHuman', desc: true }]}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recognition recipients for this round
                </div>
              )}
            </TabContent>
          </div>
        </Tabs>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="plain" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-3">
          {stablecoinRecipients.length > 0 && (
            <Button
              variant="solid"
              color="emerald"
              loading={isProposing}
              onClick={() => handleProposePayout('stablecoin')}
              icon={<HiCurrencyDollar />}
            >
              Propose Stablecoin Payout
            </Button>
          )}
          {recognitionRecipients.length > 0 && (
            <Button
              variant="solid"
              color="berrylavender"
              loading={isProposing}
              onClick={() => handleProposePayout('recognition')}
              icon={<HiCash />}
            >
              Propose Recognition Payout
            </Button>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        dialogVisible={successDialogVisible}
        txHash=""
        blockExplorer=""
        txNetwork=""
        dialogMessage="Payout transaction has been proposed to Safe. Please review and sign in the Safe interface."
        handleDialogClose={() => {
          setSuccessDialogVisible(false);
          onClose();
        }}
      >
        {safeUrl && (
          <div className="mt-4">
            <Button
              size="sm"
              variant="twoTone"
              icon={<HiExternalLink />}
              onClick={() => window.open(safeUrl, '_blank')}
            >
              Open in Safe
            </Button>
          </div>
        )}
      </SuccessDialog>

      {/* Error Dialog */}
      <ErrorDialog
        dialogVisible={errorDialogVisible}
        errorMessage={errorMessage}
        handleDialogClose={() => setErrorDialogVisible(false)}
      />

      {/* Loading Dialog */}
      <LoadingDialog
        dialogVisible={isProposing}
        message="Creating Safe transaction proposal..."
        title="Proposing Payout"
        handleDialogClose={() => {}}
      />
    </div>
  );
};

export default PayoutPreview;
