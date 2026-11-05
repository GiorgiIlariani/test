import { getCookie } from 'cookies-next';
import {
  buildCareerEditPayload,
  capitalizeFirstLetter,
  formatCareerLog,
  formatDateForBack,
  toastGeneralError,
} from 'helpers';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  deleteCareerLog,
  editCareerHistory,
  getEmployeeRequest,
  getUserCareerHistory,
  getUserCareerLog,
} from 'services';
import {
  ActionForm,
  ActionTypes,
  CareerHistory,
  CareerLogDetail,
  Currency,
  ShowPageEmployee,
} from 'types';
import { CareerLogFlowView } from './types';
import { CellData, SalaryViewType } from 'types/SalaryReport';
import { getDefaultCareerHistoryShowModalFields } from 'components/employeeId/CareerChangeShowModal/helpers';
import { GlobalApiInfo } from 'context';

export const useCareerLogFlowManager = (
  cellData: CellData | null,
  viewType: SalaryViewType,
  onClose: () => void,
  refetchReport: () => void,
) => {
  const defaultCurrency = useContext(GlobalApiInfo).applicationConfigs.currency.currency;

  const [view, setView] = useState<CareerLogFlowView>('selection');
  const [logIsLoading, setLogIsLoading] = useState(true);
  const [employee, setEmployee] = useState<ShowPageEmployee>();
  const [careerLog, setCareerLog] = useState<CareerHistory[]>([]);
  const [fullCareerHistory, setFullCareerHistory] = useState<CareerHistory[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [currentCareerLog, setCurrentCareerLog] = useState<ActionTypes>('');
  const [logDetailedInfo, setLogDetailedInfo] = useState<CareerLogDetail>();
  const [logDetailIsLoading, setLogDetailIsLoading] = useState(false);
  const [logIsInEditMode, setLogIsInEditMode] = useState(false);

  const [deleteLogDialog, setDeleteLogDialog] = useState(false);
  const [selectedLogType, setSelectedLogType] = useState<ActionTypes>('');
  const [selectedLogCurrency, setSelectedLogCurrency] = useState<Currency>();
  const [logDialogSpanText, setLogDialogSpanText] = useState('');
  const [logDialogSpanTextBoldValue, setLogDialogSpanTextBoldValue] = useState('');
  const [canNotDeleteLog, setCanNotDeleteLog] = useState(false);
  const [hideMainDialogText, setHideMainDialogText] = useState(false);

  const showModalForm = useForm({
    mode: 'onSubmit',
  });

  const fetchData = async (employeeId: number) => {
    setLogIsLoading(true);

    try {
      const token = getCookie('token');

      const [employeeResponse, careerLogResponse] = await Promise.all([
        getEmployeeRequest(employeeId, token),
        getUserCareerHistory(token, employeeId),
      ]);

      const employeeData = employeeResponse.data;
      setEmployee(employeeData);
      setFullCareerHistory(careerLogResponse.career_history);

      const filteredLogs = careerLogResponse.career_history.filter((log: CareerHistory) => {
        if (viewType === 'actual')
          return log.date.startsWith(cellData?.month || '') && log.status === 'active';
        return log.date.startsWith(cellData?.month || '');
      });
      setCareerLog(filteredLogs);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setLogIsLoading(false);
    }
  };

  useEffect(() => {
    if (cellData?.employee_id) {
      fetchData(cellData.employee_id);
    }
  }, [cellData?.employee_id]);

  const getLogDetail = async (id: number) => {
    setLogDetailIsLoading(true);
    try {
      const data = await getUserCareerLog(getCookie('token'), id);

      const formattedData = formatCareerLog(data, fullCareerHistory);

      setLogDetailedInfo(formattedData);
      showModalForm.reset(getDefaultCareerHistoryShowModalFields(formattedData));
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setLogDetailIsLoading(false);
    }
  };

  const handleEditLog = async (logType: ActionTypes, id: number) => {
    setSelectedLogId(id);
    setCurrentCareerLog(logType);
    setLogDetailIsLoading(true);
    setView('edit');
    await getLogDetail(id);
  };

  const editCareerLogHandler = async (data: Partial<ActionForm>) => {
    const payload = buildCareerEditPayload(data, logDetailedInfo);

    try {
      await editCareerHistory(getCookie('token'), logDetailedInfo?.id as number, payload);

      setLogIsInEditMode(false);
      setView('selection');
      if (cellData?.employee_id) {
        await fetchData(cellData.employee_id);
      }
      refetchReport();
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  const cancelCareerEditChanges = async (id: number) => {
    setLogDetailIsLoading(true);
    await getLogDetail(id);
  };

  const setDeleteModalBoldValueHandler = (
    type: ActionTypes = currentCareerLog ?? '',
    fallbackLog?: CareerHistory,
  ) => {
    if (!fallbackLog) {
      return;
    }

    if (type === 'Salary') {
      setSelectedLogType('Salary');
      setSelectedLogCurrency(fallbackLog.data.currency ?? 'USD');
      setLogDialogSpanTextBoldValue(
        `
         ${Number(fallbackLog?.data['salary']!).toLocaleString()}`,
      );
    } else {
      setSelectedLogType(type);
    }

    type === 'Position' && setLogDialogSpanTextBoldValue(fallbackLog?.data['position']!);
    type === 'Department' && setLogDialogSpanTextBoldValue(fallbackLog?.data['department']!);
    type === 'Seniority' && setLogDialogSpanTextBoldValue(fallbackLog?.data['seniority']!);
    type === 'Termination' && setLogDialogSpanTextBoldValue('previous termination reasons');
    type === 'Availability' && setLogDialogSpanTextBoldValue(fallbackLog?.data['availability']!);
    type === 'Job type' &&
      setLogDialogSpanTextBoldValue(capitalizeFirstLetter(fallbackLog?.data['job_type']!));
  };

  const openDeleteLogModalHandler = (
    type: ActionTypes = currentCareerLog ?? '',
    id: number | null = selectedLogId ?? null,
  ) => {
    setSelectedLogId(id);
    setDeleteLogDialog(true);

    const sameLogs = fullCareerHistory.filter(
      (item) => item.type.toLowerCase() === type.toLowerCase(),
    );

    const sameLogsLastIndex = sameLogs.length - 1;

    const currentLogIndex = sameLogs.findIndex((item) => item.id === id);

    const currentLog = fullCareerHistory.find((item) => item.id === id) as CareerHistory;

    const fallbackLog = currentLogIndex > 0 ? sameLogs[currentLogIndex - 1] : undefined;

    const joinDate = formatDateForBack(new Date(employee!.join_date));
    const currentLogDate = formatDateForBack(new Date(currentLog?.date));

    if (type !== 'Termination' && type !== 'Re-employed') {
      if (
        sameLogs.length === 1 ||
        (currentLogDate === joinDate && currentLogIndex === sameLogsLastIndex)
      ) {
        setCanNotDeleteLog(true);
        setHideMainDialogText(true);
        setLogDialogSpanText(
          currentLogDate === joinDate
            ? "You can't delete this activity, please add another same kind of activity"
            : "You can't delete this activity, please add another same kind of activity and then delete this",
        );
      } else if (sameLogs.length > 1 && currentLogIndex === sameLogsLastIndex) {
        setHideMainDialogText(true);
        setCanNotDeleteLog(false);
        setLogDialogSpanText(fallbackLog?.type.toLowerCase() ?? '');
        setDeleteModalBoldValueHandler(type, fallbackLog);
      } else {
        setHideMainDialogText(false);
        setCanNotDeleteLog(false);
      }
    }
  };

  const deleteLogHandler = async () => {
    try {
      await deleteCareerLog(getCookie('token'), selectedLogId as number);

      setDeleteLogDialog(false);
      setView('selection');
      if (cellData?.employee_id) {
        await fetchData(cellData.employee_id);
      }
      refetchReport();
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  const getOldSalaryInfoHandler = (
    currentCareerHistorableId: number,
    currentCareerDate: string,
  ) => {
    const salaryLogs = fullCareerHistory.filter((item) => item.type === 'Salary');
    const oldSalaryInfo = salaryLogs.filter(
      (log) =>
        new Date(log.date) <= new Date(currentCareerDate) && log.id !== currentCareerHistorableId,
    )[0];

    return {
      oldSalary: oldSalaryInfo?.data?.salary,
      oldCurrency: oldSalaryInfo?.data?.currency ?? 'USD',
      oldPaymentType: oldSalaryInfo?.data?.payment_type ?? 'monthly',
    };
  };

  return {
    view,
    setView,
    employee,
    careerLog,
    fullCareerHistory,
    logIsLoading,
    handleEditLog,
    currentCareerLog,
    logDetailedInfo,
    logDetailIsLoading,
    logIsInEditMode,
    setLogIsInEditMode,
    showModalForm,
    editCareerLogHandler,
    cancelCareerEditChanges,
    getOldSalaryInfoHandler,
    fetchData,
    defaultCurrency,
    closeLogInfoHandler: onClose,
    deleteLogDialog,
    setDeleteLogDialog,
    openDeleteLogModalHandler,
    deleteLogHandler,
    canNotDeleteLog,
    hideMainDialogText,
    logDialogSpanText,
    logDialogSpanTextBoldValue,
    selectedLogType,
    selectedLogCurrency,
  };
};
