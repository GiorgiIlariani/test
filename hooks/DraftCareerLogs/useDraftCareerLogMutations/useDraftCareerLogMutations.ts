import { getDefaultCareerHistoryShowModalFields } from 'components/employeeId/CareerChangeShowModal/helpers';
import { getCookie } from 'cookies-next';
import { buildCareerEditPayload, formatCareerLog, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { editCareerHistory, getUserCareerLog } from 'services';
import { ActionForm, CareerHistory, CareerHistoryStatus, CareerLogDetail } from 'types';

export const useDraftCareerLogMutations = (
  showModalForm: UseFormReturn<FieldValues, any, undefined>,
  refetchTable: () => Promise<void> | void,
  fullCareerHistory: CareerHistory[],
) => {
  const [logDetailedInfo, setLogDetailedInfo] = useState<CareerLogDetail>();
  const [logDetailIsLoading, setLogDetailIsLoading] = useState(false);

  const getLogDetail = async (id: number, history: CareerHistory[]) => {
    setLogDetailIsLoading(true);

    try {
      const data = await getUserCareerLog(getCookie('token'), id);
      const formattedData = formatCareerLog(data, history);
      setLogDetailedInfo(formattedData);
      showModalForm.reset(getDefaultCareerHistoryShowModalFields(formattedData));
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setLogDetailIsLoading(false);
    }
  };

  const editCareerLogHandler = async (
    data: Partial<ActionForm>,
    statusOverride?: CareerHistoryStatus,
    careerLogDetailOverride?: CareerLogDetail,
  ) => {
    const currentLogDetailedInfo = careerLogDetailOverride ?? logDetailedInfo;

    if (!currentLogDetailedInfo) {
      return;
    }

    const payload = buildCareerEditPayload(
      {
        ...data,
        status: statusOverride ?? data.status,
      },
      currentLogDetailedInfo,
    );

    try {
      await editCareerHistory(getCookie('token'), currentLogDetailedInfo.id, payload);
      refetchTable();
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  const cancelCareerEditChanges = async (id: number) => {
    await getLogDetail(id, fullCareerHistory);
  };

  return {
    getLogDetail,
    logDetailedInfo,
    logDetailIsLoading,
    editCareerLogHandler,
    cancelCareerEditChanges,
  };
};
