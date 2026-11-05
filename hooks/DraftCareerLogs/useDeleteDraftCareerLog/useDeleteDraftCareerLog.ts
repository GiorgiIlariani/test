import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useState } from 'react';
import { deleteCareerLog, bulkDeleteCareerLogs } from 'services';
import { DraftCareerLogLeafRow } from 'types';

export const useDeleteDraftCareerLog = (
  refetchTable: () => Promise<void> | void,
  rowData: DraftCareerLogLeafRow | DraftCareerLogLeafRow[] | null,
  setRowData: (data: DraftCareerLogLeafRow | DraftCareerLogLeafRow[] | null) => void,
) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteClick = (row: DraftCareerLogLeafRow | DraftCareerLogLeafRow[]) => {
    setRowData(row);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteLog = async () => {
    if (!rowData) return;

    setIsDeleteLoading(true);
    try {
      if (Array.isArray(rowData)) {
        await bulkDeleteCareerLogs(
          getCookie('token'),
          rowData.map((row) => row.id),
        );
      } else {
        await deleteCareerLog(getCookie('token'), rowData.id);
      }

      refetchTable();
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsDeleteLoading(false);
      closeDeleteModal();
    }
  };

  return {
    handleDeleteClick,
    handleDeleteLog,
    closeDeleteModal,
    isDeleteModalOpen,
    isDeleteLoading,
  };
};
