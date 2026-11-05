import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useState } from 'react';
import { getEmployeeRequest, getUserCareerHistory } from 'services';
import { ActionTypes, CareerHistory, DraftCareerLogLeafRow, ShowPageEmployee } from 'types';

export const useViewDraftCareerLog = (
  getLogDetail: (id: number, history: CareerHistory[]) => Promise<void>,
  setFullCareerHistory: (history: CareerHistory[]) => void,
  setRowData: (data: DraftCareerLogLeafRow | null) => void,
) => {
  const [employee, setEmployee] = useState<ShowPageEmployee>();
  const [careerLogType, setCareerLogType] = useState<ActionTypes>('');
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [isRowModalLoading, setIsRowModalLoading] = useState(false);
  const [logIsInEditMode, setLogIsInEditMode] = useState(false);

  const handleRowClick = async (rowData: DraftCareerLogLeafRow, isInEditMode: boolean = false) => {
    setRowData(rowData);
    setIsRowModalOpen(true);
    setIsRowModalLoading(true);
    setLogIsInEditMode(isInEditMode);
    setCareerLogType(rowData.type as ActionTypes);

    try {
      const token = getCookie('token');
      const [employeeResponse, careerLogResponse] = await Promise.all([
        getEmployeeRequest(rowData.employee.id, token),
        getUserCareerHistory(token, rowData.employee.id),
      ]);

      setEmployee(employeeResponse.data);
      setFullCareerHistory(careerLogResponse.career_history);

      await getLogDetail(rowData.id, careerLogResponse.career_history);
    } catch (error) {
      toastGeneralError(error);
      setIsRowModalOpen(false);
    } finally {
      setIsRowModalLoading(false);
    }
  };

  const closeRowModal = () => {
    setIsRowModalOpen(false);
  };

  return {
    handleRowClick,
    closeRowModal,
    isRowModalOpen,
    isRowModalLoading,
    employee,
    logIsInEditMode,
    setLogIsInEditMode,
    careerLogType,
  };
};
