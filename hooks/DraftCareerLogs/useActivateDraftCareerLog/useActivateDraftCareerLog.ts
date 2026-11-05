import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useState } from 'react';
import { activateCareerLog, bulkActivateCareerLogs } from 'services';
import { DraftCareerLogLeafRow } from 'types';

export const useActivateDraftCareerLog = (
  refetchTable: () => Promise<void> | void,
  rowData: DraftCareerLogLeafRow | DraftCareerLogLeafRow[] | null,
  setRowData: (data: DraftCareerLogLeafRow | DraftCareerLogLeafRow[] | null) => void,
) => {
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isActivateLoading, setIsActivateLoading] = useState(false);

  const handleActivateClick = (row: DraftCareerLogLeafRow | DraftCareerLogLeafRow[]) => {
    setRowData(row);
    setIsActivateModalOpen(true);
  };

  const closeActivateModal = () => {
    setIsActivateModalOpen(false);
  };

  const handleActivateLog = async () => {
    if (!rowData) return;

    setIsActivateLoading(true);
    try {
      if (Array.isArray(rowData)) {
        await bulkActivateCareerLogs(
          getCookie('token'),
          rowData.map((row) => row.id),
        );
      } else {
        await activateCareerLog(getCookie('token'), rowData.id);
      }

      refetchTable();
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsActivateLoading(false);
      closeActivateModal();
    }
  };

  return {
    handleActivateClick,
    handleActivateLog,
    closeActivateModal,
    isActivateModalOpen,
    isActivateLoading,
  };
};
