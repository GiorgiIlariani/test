'use client';

import { getCookie } from 'cookies-next';
import {
  addClickAwayHandler,
  buildCareerEditPayload,
  capitalizeFirstLetter,
  formatCareerLog,
  formatDateForBack,
  formatTextFirstStringUpperCase,
  toastGeneralError,
} from 'helpers';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import {
  administrativeInformation,
  deleteCareerLog,
  editCareerHistory,
  getUserCareerHistory,
  getUserCareerLog,
} from 'services';
import {
  ActionForm,
  ActionTypes,
  CareerHistory,
  CareerHistoryHeader,
  CareerLog,
  CareerLogDetail,
  Currency,
  EmployeeFormFieldDefaults,
  OrganizationInformation,
  ShowPageEmployee,
} from 'types';
import { EmployeeMiniData } from './types';
import { getDefaultCareerHistoryShowModalFields } from '../CareerChangeShowModal/helpers';

export const useCareerLog = (
  actionsAreAdded: boolean,
  careerLogEmployeeData: EmployeeMiniData,
  refetchEmployees: (heavyReload?: boolean) => void,
  employee: ShowPageEmployee,
) => {
  const { setValue, getValues } = useFormContext<EmployeeFormFieldDefaults>();
  const [logIsLoading, setLogIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [careerLog, setCareerLog] = useState<CareerHistory[]>([]);
  const [careerLogInitialState, setCareerLogInitialState] = useState<CareerHistory[]>([]);
  const [deleteLogDialog, setDeleteDialog] = useState(false);
  const [logIsdeleted, setLogIsDeleted] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [selectedLogType, setSelectedLogType] = useState<ActionTypes>();
  const [selectedLogCurrency, setSelectedLogCurrency] = useState<Currency>();
  const [logDialogSpanText, setLogDialogSpanText] = useState('');
  const [showModalIsOpen, setShowModalIsOpen] = useState(false);
  const [logDialogSpanTextBoldValue, setLogDialogSpanTextBoldValue] = useState('');
  const [currentCareerLog, setCurrentCareerLog] = useState<ActionTypes>('');
  const [canNotDeleteLog, setCanNotDeleteLog] = useState(false);
  const [hideMainDialogText, setHideMainDialogText] = useState(false);
  const [logDetailedInfo, setLogDetailedInfo] = useState<CareerLogDetail>();
  const [logDetailIsLoading, setLogDetailIsLoading] = useState(true);
  const [currentProjects, setCurrentProjects] = useState<string[]>([]);
  const [logIsInEditMode, setLogIsInEditMode] = useState<boolean>(false);
  const [headerCareerInfo, setHeaderCareerInfo] = useState<CareerHistoryHeader>({
    position: careerLogEmployeeData?.position,
    positionDate: careerLogEmployeeData?.updatedDate,
    seniority: careerLogEmployeeData?.seniority,
    seniorityDate: careerLogEmployeeData?.updatedDate,
    salary: careerLogEmployeeData?.salary as string,
    salaryDate: careerLogEmployeeData?.updatedDate,
    salaryPaymentType: careerLogEmployeeData?.payment_type,
    currency: careerLogEmployeeData?.currency ?? 'USD',
    project: careerLogEmployeeData?.project ?? '-',
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userId = Number(router.query.id);

  const showModalForm = useForm({
    mode: 'onSubmit',
  });

  const CareerLogOptionsInitialState = [
    { id: 1, title: 'Position', value: 'Position', checked: true },
    { id: 2, title: 'Seniority', value: 'Seniority', checked: true },
    { id: 3, title: 'Salary', value: 'Salary', checked: true },
    { id: 4, title: 'Projects', value: 'boarded', checked: true },
    { id: 5, title: 'Transfer', value: 'Department', checked: true },
    { id: 6, title: 'Termination', value: 'Termination', checked: true },
    { id: 7, title: 'Recruiting', value: 'Started working', checked: true },
    { id: 8, title: 'Availability', value: 'Availability', checked: true },
    { id: 9, title: 'Employment type', value: 'Job type', checked: true },
    { id: 10, title: 'Rehire', value: 'Re-employed', checked: true },
  ];
  const [checkAllFilter, setCheckAllFilter] = useState(true);
  const [careerFilter, setCareerFilter] = useState(CareerLogOptionsInitialState);
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInformation>();

  const filterLogTypes = (careerData: CareerHistory[]) => {
    const position = careerData.filter((item) => item.type === 'Position')[0];
    const seniority = careerData.filter((item) => item.type === 'Seniority')[0];
    const department = careerData.filter((item) => item.type === 'Department')[0];
    const salary = careerData.filter((item) => item.type === 'Salary')[0];
    const project = careerData.find((item) => item.type === 'On boarded');

    return { position, seniority, department, salary, project };
  };

  const getLatestCareerHistory = (careerData: CareerHistory[]) => {
    const presentLogs = careerData.filter(
      (log) => new Date(log.date) <= new Date() && log.status !== 'draft',
    );
    const { position, seniority, department, salary, project } = filterLogTypes(presentLogs);
    setHeaderCareerInfo((prev) => ({
      ...prev,
      position: position?.data?.position ?? prev.position,
      position_id: position?.career_historable_id,
      positionDate: position?.date ?? prev.positionDate,
      seniority: seniority?.data?.seniority ?? prev.seniority,
      seniority_id: seniority?.career_historable_id,
      seniorityDate: seniority?.date ?? prev.seniorityDate,
      salary: salary?.data?.salary ?? prev.salary,
      salaryDate: salary?.date ?? prev.salaryDate,
      salaryPaymentType: salary?.data?.payment_type ?? prev.salaryPaymentType,
      currency: salary?.data?.currency ?? prev.currency ?? 'USD',
      project: project?.data?.project ?? prev.project,
      department: department?.data?.department,
      department_id: department?.career_historable_id,
    }));
  };

  const getCareerHistory = async () => {
    setLogIsLoading(true);
    try {
      const data = await getUserCareerHistory(getCookie('token'), userId);
      const adminInfo = await administrativeInformation(getCookie('token'));
      setOrganizationInfo(adminInfo.administrative_information);
      const filteredCareerHistory = data.career_history.filter((log: CareerHistory[][number]) =>
        careerFilter.find(
          (filteringOption) =>
            log.type.includes(filteringOption.value) && filteringOption.checked === true,
        ),
      );
      setCareerLog(filteredCareerHistory);
      const { position, seniority, salary } = filterLogTypes(data.career_history);

      setHeaderCareerInfo({
        position: careerLogEmployeeData?.position,
        positionDate: position?.date,
        seniority: careerLogEmployeeData?.seniority,
        seniorityDate: seniority?.date,
        salary: careerLogEmployeeData?.salary as string,
        salaryDate: salary?.date,
        salaryPaymentType: careerLogEmployeeData?.payment_type,
        currency: careerLogEmployeeData?.currency ?? 'USD',
        project: careerLogEmployeeData?.project ?? '-',
      });
      setCareerLogInitialState(data.career_history);
      getLatestCareerHistory(data.career_history);
      setLogIsLoading(false);
      setCurrentProjects(
        data.current_projects.map((item) => formatTextFirstStringUpperCase(item.title)),
      );
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    getCareerHistory();
  }, [userId, actionsAreAdded, logIsdeleted]);

  const editCareerLogHandler = async (data: Partial<ActionForm>) => {
    const payload = buildCareerEditPayload(data, logDetailedInfo);

    try {
      await editCareerHistory(getCookie('token'), logDetailedInfo?.id as number, payload);

      const date = new Date(data.date!);
      const currentSalaryStartDate = new Date(getValues('salary_start_date')?.toString() ?? '');
      date.setHours(0);
      currentSalaryStartDate.setHours(0);
      if (date >= currentSalaryStartDate) {
        data.salary && setValue('salary.salary', data.salary);
        data.currency && setValue('salary.currency', data.currency ?? 'USD');
      }
      data.seniority_id && setValue('seniority_id', data.seniority_id);
      data.department_id && setValue('department_id', data.department_id);
      data.position_id && setValue('position_id', data.position_id);
      setShowModalIsOpen(false);
      setLogIsInEditMode(false);
      refetchEmployees(true);
      getCareerHistory();
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const dropdownToggler = () => {
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    setIsOpen((prev) => !prev);
  };

  const optionsChangeHandler = (option: CareerLog) => {
    setCareerFilter((prev) =>
      prev.map((item) => (item.id === option.id ? { ...item, checked: !item.checked } : item)),
    );
    const careerFilterLength = careerFilter
      .map((item) => (item.id === option.id ? { ...item, checked: !item.checked } : item))
      .filter((item) => item.checked === true).length;

    careerFilterLength === 7 ? setCheckAllFilter(true) : setCheckAllFilter(false);

    let updatedCareerFilter = careerFilter.map((item) =>
      item.id === option.id ? { ...item, checked: !item.checked } : item,
    );
    setCareerLog(
      careerLogInitialState.filter((log) =>
        updatedCareerFilter.find(
          (filteringOption) =>
            log.type.includes(filteringOption.value) && filteringOption.checked === true,
        ),
      ),
    );
  };

  const checkAllOptionsChangeHandler = () => {
    setCheckAllFilter((prev) => !prev);
    setCareerFilter((prev) => prev.map((item) => ({ ...item, checked: !checkAllFilter })));

    setCareerLog(checkAllFilter ? [] : careerLogInitialState);
  };

  const getLogDetail = async (id: number) => {
    try {
      const data = await getUserCareerLog(getCookie('token'), id);

      const formattedData = formatCareerLog(data, careerLog);

      setLogDetailedInfo(formattedData);
      showModalForm.reset(getDefaultCareerHistoryShowModalFields(formattedData));
    } catch (error: any) {
      toastGeneralError(error, router);
    } finally {
      setLogDetailIsLoading(false);
    }
  };

  const openLogInfoHandler = async (dataField: ActionTypes, id: number) => {
    setLogDetailIsLoading(true);
    setShowModalIsOpen(true);
    setCurrentCareerLog(dataField);
    await getLogDetail(id);
    setSelectedLogId(id);
  };

  const openEditLogInfoHandler = async (dataField: ActionTypes, id: number) => {
    setCurrentCareerLog(dataField);
    setLogDetailIsLoading(true);
    setShowModalIsOpen(true);
    await getLogDetail(id);
    setLogIsInEditMode(true);
    setSelectedLogId(id);
  };

  const cancelCareerEditChanges = async (id: number) => {
    setLogDetailIsLoading(true);
    await getLogDetail(id);
  };

  const closeLogInfoHandler = () => {
    setShowModalIsOpen(false);
    setCurrentCareerLog('');
    setLogIsInEditMode(false);
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
    setDeleteDialog(true);

    const sameLogs = careerLog.filter((item) => item.type.toLowerCase() === type.toLowerCase());

    const sameLogsLastIndex = sameLogs.length - 1;

    const currentLogIndex = sameLogs.findIndex((item) => item.id === id);

    const currentLog = careerLog.find((item) => item.id === id) as CareerHistory;

    const fallbackLog = currentLogIndex > 0 ? sameLogs[currentLogIndex - 1] : undefined;

    const joinDate = formatDateForBack(new Date(employee.join_date));
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
      setCareerLog((prev) => prev.filter((item) => item.id !== selectedLogId));
      setCareerLogInitialState((prev) => prev.filter((item) => item.id !== selectedLogId));

      await deleteCareerLog(getCookie('token'), selectedLogId as number);
      const filteredByType = careerLog.filter((item) => {
        const isSameType =
          selectedLogType === 'Re-employed'
            ? ['Re-employed', 'Started working'].includes(item.type)
            : item.type === selectedLogType;

        return isSameType && item.id !== selectedLogId;
      });

      switch (selectedLogType) {
        case 'Seniority':
          setValue('seniority_id', filteredByType[0].career_historable_id);
          break;
        case 'Department':
          setValue('department_id', filteredByType[0].career_historable_id);
          break;
        case 'Position':
          setValue('position_id', filteredByType[0].career_historable_id);
          break;
        case 'Salary':
          setValue('salary.salary', +filteredByType[0].data.salary!);
          setValue('salary.currency', filteredByType[0].data.currency! ?? 'USD');
          break;
        case 'Termination':
          setValue('leave_date', filteredByType[0].date);
          break;
        case 'Availability':
          setValue('availability', filteredByType[0].date);
        case 'Re-employed':
          setValue('join_date', filteredByType[0].date);
          break;
      }
      setDeleteDialog(false);
      setLogIsDeleted((prev) => !prev);
      setShowModalIsOpen(false);
      refetchEmployees(true);
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const firstTypeOfLogEntry = (careerLog: CareerHistory[], careerLogItem: CareerHistory) => {
    const sameTypeOfLogs = careerLog.filter((item) => item.type === careerLogItem.type);
    const firstLogEntry =
      sameTypeOfLogs[sameTypeOfLogs.length - 1].id === careerLogItem.id ? true : false;
    return firstLogEntry;
  };

  const getOldSalaryInfoHandler = (
    currentCareerHistorableId: number,
    currentCareerDate: string,
  ) => {
    const salaryLogs = careerLog.filter((item) => item.type === 'Salary');
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
    logIsLoading,
    setLogIsLoading,
    isOpen,
    dropdownToggler,
    careerFilter,
    setCareerFilter,
    careerLog,
    setCareerLog,
    buttonRef,
    dropdownRef,
    optionsChangeHandler,
    deleteLogDialog,
    setDeleteDialog,
    openDeleteLogModalHandler,
    deleteLogHandler,
    selectedLogId,
    logDialogSpanText,
    setLogDialogSpanText,
    logDialogSpanTextBoldValue,
    canNotDeleteLog,
    hideMainDialogText,
    currentCareerLog,
    setCurrentCareerLog,
    showModalIsOpen,
    setShowModalIsOpen,
    openLogInfoHandler,
    closeLogInfoHandler,
    selectedLogType,
    selectedLogCurrency,
    logDetailIsLoading,
    logDetailedInfo,
    checkAllOptionsChangeHandler,
    checkAllFilter,
    headerCareerInfo,
    firstTypeOfLogEntry,
    currentProjects,
    logIsInEditMode,
    setLogIsInEditMode,
    openEditLogInfoHandler,
    editCareerLogHandler,
    getOldSalaryInfoHandler,
    showModalForm,
    cancelCareerEditChanges,
    organizationInfo,
  };
};
