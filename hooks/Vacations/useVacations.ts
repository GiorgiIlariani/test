'use client';

import { useEffect, useState } from 'react';
import {
  Department,
  EmployeeFilterAndSortReducerDispatch,
  EmployeeVacations,
  FilterOptions,
  Recruiter,
  StaffMinimalEmployee,
  TimeOffConfig,
  VacationPeriod,
  VacationsArray,
  VacationStatus,
} from 'types';
import { useContext } from 'react';
import { GlobalApiInfo } from 'context';
import {
  analytics,
  binFileDownloadHandler,
  filterReviewableVacation,
  formatFilterOptionsForBackend,
  toastGeneralError,
  updateVacationQuery,
} from 'helpers';
import { getCookie } from 'cookies-next';
import {
  getMinimalUsers,
  getReviewers,
  getVacation,
  getVacationPeriodsForUser,
  getVacationsDashboard,
  getVacationsExcel,
  getVacationsForReview,
} from 'services';
import { useRouter } from 'next/router';

export const useVacations = (userId: number, filter: FilterOptions[]) => {
  const router = useRouter();
  const [adding, setAdding] = useState<
    | boolean
    | {
        year: number;
        month: number;
      }
  >(false);
  const { rawSeniorities, positions, departments } = useContext(GlobalApiInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewPendingVacation, setReviewPendingVacation] = useState(!!router.query.vacation_id);
  const [vacationData, setVacationData] = useState<VacationsArray[]>([]);
  const [employeeMinimalData, setEmployeeMinimalData] = useState<{
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    department: Department;
  }>();
  const [currentVacationInfo, setCurrentVacationInfo] = useState({
    sum: 0,
    currentIndex: 0,
  });
  const [currentUserVacationPeriods, setCurrentUserVacationPeriods] = useState<VacationPeriod[]>();
  const [vacationNotFound, setVacationNotFound] = useState(false);
  const [modalType, setModalType] = useState<VacationStatus | undefined>(
    router.query.vacation_id ? 'pending' : undefined,
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isInReviewAllMode, setIsInReviewAllMode] = useState(router.query.review_all === '1');
  const [notResponseError, setNotResponseError] = useState(false);
  const [reviewers, setReviewers] = useState<Recruiter[]>([]);
  const [vacations, setVacations] = useState<EmployeeVacations[]>([]);
  const [reviewableVacations, setReviewableVacations] = useState<VacationsArray[]>([]);
  const [employeesForReviewableVacations, setEmployeesForReviewableVacations] = useState<
    EmployeeVacations[]
  >([]);
  const [config, setConfig] = useState<TimeOffConfig>({
    trial_period: 11,
    trial_bonus_days: 5,
    final_reviewer: 5,
    yearly_vacation_days: 24,
  });
  const [excelButtonIsLoading, setExcelButtonIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [minimalUsers, setMinimalUsers] = useState<StaffMinimalEmployee[]>([]);
  const [individualVacationIsLoading, setIndividualVacationIsLoading] = useState(false);
  const [vacationPeriodsForIndividualVacation, setVacationPeriodsForIndividualVacation] =
    useState<VacationPeriod[]>();

  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(filter);

  const { applicationConfigs } = useContext(GlobalApiInfo);

  const toggleAdding = () => {
    analytics.track('Time offs - Request Time off');
    setAdding(typeof adding === 'boolean' ? !adding : false);
  };

  const openAddingInSetTime = (data: { year: number; month: number }) => {
    analytics.track('Time offs - Request Time off from Table Cell');
    setAdding(data);
  };

  const selectYearHandler = async (year: number) => {
    setCurrentYear(year);
    setIsLoading(true);
    await updateVacations(year, filterOptions, 1);
    setIsLoading(false);
  };

  const getIndividualVacation = async () => {
    try {
      setIndividualVacationIsLoading(true);
      const response = await getVacation(Number(router.query?.vacation_id), getCookie('token'));
      const vacationPeriods = await getVacationPeriodsForUser(
        getCookie('token'),
        response.data.employee_id,
        new Date(response.data.start_date).getFullYear(),
      );

      setVacationPeriodsForIndividualVacation(vacationPeriods);
      setEmployeeMinimalData(response.data.employee);

      setVacationData([response.data]);
      setReviewPendingVacation(true);
      setModalType(response.data.status);
    } catch (error: any) {
      if (error.response) {
        error.response.status === 404 || error.response.status === 403
          ? setVacationNotFound(true)
          : toastGeneralError(error);
      } else {
        setNotResponseError(true);
      }
    } finally {
      setIndividualVacationIsLoading(false);
    }
  };

  useEffect(() => {
    router.query.vacation_id && getIndividualVacation();
  }, [router]);

  const getTimeOff = async (argumentFilter = filterOptions) => {
    setIsLoading(true);
    try {
      const token = getCookie('token');

      const filtersForApi = formatFilterOptionsForBackend(argumentFilter);

      const [reviewers, vacations, minimalUsers, vacationsForReview, currentUserVacationPeriods] =
        await Promise.all([
          getReviewers(token),
          getVacationsDashboard(new Date().getFullYear(), token, currentPage, filtersForApi),
          getMinimalUsers(getCookie('token'), 1),
          getVacationsForReview(getCookie('token')),
          getVacationPeriodsForUser(token, userId, new Date().getFullYear()),
        ]);

      router.query.vacation_id && getIndividualVacation();

      setMinimalUsers(minimalUsers.data);
      setVacations(vacations.data);
      setCurrentUserVacationPeriods(currentUserVacationPeriods);
      setLastPage(vacations.meta.last_page);

      setReviewableVacations(vacationsForReview.vacations);
      setSumOfAllReviewableVacations(vacationsForReview.vacations.length);
      setEmployeesForReviewableVacations(vacationsForReview.employees);

      setConfig(applicationConfigs.time_off);
      setReviewers(reviewers.data);
    } catch (error: any) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTimeOff();
  }, []);

  const openReviewAllModal = () => {
    setIsInReviewAllMode(true);
    setReviewPendingVacation(true);
    setModalType('pending');
    setVacationData(reviewableVacations);
    setCurrentVacationInfo({
      sum: reviewableVacations?.length,
      currentIndex: 0,
    });

    analytics.track('Time offs - Review all');
    setEmployeeMinimalData({
      ...(reviewableVacations[0].employee as EmployeeVacations),
      department: reviewableVacations[0]?.department as EmployeeVacations['department'],
    });
    updateVacationQuery({
      review_all: '1',
      vacation_id: String(reviewableVacations[0].id),
    });
  };

  const [sumOfAllReviewableVacations, setSumOfAllReviewableVacations] = useState(
    reviewableVacations?.length,
  );

  const openModal = (
    vacationsArray: VacationsArray[],
    employeeId: number,
    modalType: VacationStatus,
  ) => {
    const currentVacationByType = vacationsArray.filter((item) => item.status === modalType);
    const isMultiple = currentVacationByType?.length > 1;
    setReviewPendingVacation(true);
    setModalType(modalType);
    if (isMultiple) {
      setVacationData(currentVacationByType);
      setCurrentVacationInfo({
        sum: vacationsArray.filter((item) => item.status === modalType)?.length,
        currentIndex: 0,
      });
    } else {
      const employeeVacationArray = vacations?.find((employee) => employee.id === employeeId);
      employeeVacationArray &&
        setVacationData([
          employeeVacationArray.vacations.find(
            (vacation) => vacation.id === currentVacationByType[0].id,
          )!,
        ]);
    }

    setEmployeeMinimalData(vacations?.find((employee) => employee.id === employeeId));

    updateVacationQuery({
      vacation_id: String(currentVacationByType[0].id),
      review_all: router.query.review_all ? '1' : undefined,
    });
  };

  const nextVacationModalData = () => {
    setCurrentVacationInfo((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
    if (isInReviewAllMode) {
      setEmployeeMinimalData(
        reviewableVacations?.length > 1
          ? {
              ...(reviewableVacations[currentVacationInfo.currentIndex + 1]
                ?.employee as EmployeeVacations),
              department: reviewableVacations[currentVacationInfo.currentIndex + 1]?.department!,
            }
          : (reviewableVacations[0]?.employee as EmployeeVacations),
      );
    }

    updateVacationQuery({
      vacation_id: String(vacationData[currentVacationInfo.currentIndex + 1]?.id),
      review_all: router.query.review_all ? '1' : undefined,
    });
  };

  const previousVacationModalData = () => {
    setCurrentVacationInfo((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex - 1,
    }));
    if (isInReviewAllMode) {
      setEmployeeMinimalData(
        reviewableVacations?.length > 1
          ? {
              ...(reviewableVacations[currentVacationInfo.currentIndex - 1]
                ?.employee as EmployeeVacations),
              department: reviewableVacations[0]?.department as EmployeeVacations['department'],
            }
          : (reviewableVacations[0]?.employee as EmployeeVacations),
      );
    }

    updateVacationQuery({
      vacation_id: String(vacationData[currentVacationInfo.currentIndex - 1]?.id),
      review_all: router.query.review_all ? '1' : undefined,
    });
  };

  const updateVacations = async (
    year?: number,
    argumentFilter = filterOptions,
    page = currentPage,
    fullReload = false,
  ) => {
    try {
      const filtersForApi = formatFilterOptionsForBackend(argumentFilter);

      const [response, vacationsForReview, currentUserVacationPeriods] = await Promise.all([
        getVacationsDashboard(
          year ?? currentYear,
          getCookie('token'),
          fullReload ? 1 : page,
          filtersForApi,
        ),
        getVacationsForReview(getCookie('token')),
        getVacationPeriodsForUser(getCookie('token'), userId, year ?? currentYear),
      ]);

      setVacations((prev) => {
        if (page === 1 || fullReload) {
          return response.data;
        } else {
          const existingVacations = [...prev];
          existingVacations.push(...response.data);
          return existingVacations;
        }
      });

      setCurrentUserVacationPeriods(currentUserVacationPeriods);
      setCurrentPage(fullReload ? 1 : page);
      setLastPage(response.meta.last_page);

      if (year || router.query.vacation_id) {
        setSumOfAllReviewableVacations(vacationsForReview?.vacations.length);
        setReviewableVacations(vacationsForReview.vacations);
        setEmployeesForReviewableVacations(vacationsForReview.employees);
      }
    } catch (error: any) {
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  const closeModal = (latestVacationData?: VacationsArray[]) => {
    setModalType(undefined);

    const newVacationsToReview = filterReviewableVacation(
      latestVacationData ?? vacationData,
      userId,
      reviewableVacations,
    );
    setSumOfAllReviewableVacations(newVacationsToReview?.length);
    setReviewableVacations(newVacationsToReview);

    setReviewPendingVacation(false);
    setIsInReviewAllMode(false);
    setVacationPeriodsForIndividualVacation(undefined);
    setCurrentVacationInfo({ sum: 0, currentIndex: 0 });
    updateVacationQuery({
      vacation_id: null,
      review_all: null,
    });
  };

  const sumOfVacationDays = vacations.reduce((total: number, employee: EmployeeVacations) => {
    if (employee.vacation_periods.length > 0) {
      const firstPeriod = employee.vacation_periods[0];
      const subCycleDaysUsed = firstPeriod.sub_cycles?.reduce(
        (t, c) => t + c.vacation_days_used,
        0,
      );
      total += subCycleDaysUsed;
    }
    return total;
  }, 0);

  const sumOfSickDays = vacations.reduce((total: number, employee: EmployeeVacations) => {
    if (employee.vacation_periods.length > 0) {
      const firstPeriod = employee.vacation_periods[0];
      const subCycleDaysUsed = firstPeriod.sub_cycles?.reduce((t, c) => t + c.sick_days_used, 0);
      total += subCycleDaysUsed;
    }
    return total;
  }, 0);

  const sumOfVacationsTable = {
    vacationDays: sumOfVacationDays,
    sickDays: sumOfSickDays,
  };

  const closeVacationNotFoundModal = () => {
    setVacationNotFound(false);
    updateVacationQuery({
      vacation_id: null,
      review_all: null,
    });
  };

  const getExcelHandler = async () => {
    setExcelButtonIsLoading(true);
    const token = getCookie('token');
    const filtersForApi = formatFilterOptionsForBackend(filterOptions);
    await binFileDownloadHandler(
      () => getVacationsExcel(token, currentYear, filtersForApi),
      `time-off-${currentYear}.xlsx`,
      toastGeneralError,
    );
    setExcelButtonIsLoading(false);
  };

  const handleFilterChange: EmployeeFilterAndSortReducerDispatch = async (value) => {
    const newFilter = value.type === 'CLEAR_ALL_FILTER' ? [] : value.payload?.filterOptions!;
    setFilterOptions(newFilter);
    setIsLoading(true);
    await updateVacations(currentYear, newFilter, 1);
    setIsLoading(false);
  };

  const hasMoreVacations = !!lastPage && currentPage < lastPage;

  const loadMoreVacations = async () => {
    if (isLoading || isLoadingMore || !hasMoreVacations) return;

    setIsLoadingMore(true);
    try {
      await updateVacations(currentYear, filterOptions, currentPage + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    vacations,
    isLoading,
    toggleAdding,
    adding,
    reviewPendingVacation,
    closeModal,
    openModal,
    vacationData,
    employeeMinimalData,
    rawSeniorities,
    positions,
    departments,
    updateVacations,
    currentVacationInfo,
    nextVacationModalData,
    previousVacationModalData,
    setVacationData,
    modalType,
    selectYearHandler,
    currentYear,
    reviewableVacations,
    openReviewAllModal,
    sumOfAllReviewableVacations,
    setSumOfAllReviewableVacations,
    isInReviewAllMode,
    setModalType,
    vacationNotFound,
    setVacationNotFound,
    sumOfVacationsTable,
    openAddingInSetTime,
    notResponseError,
    setNotResponseError,
    reviewers,
    config,
    closeVacationNotFoundModal,
    excelButtonIsLoading,
    getExcelHandler,
    filterOptions,
    setFilterOptions,
    handleFilterChange,
    isLoadingMore,
    setIsLoadingMore,
    minimalUsers,
    currentPage,
    getIndividualVacation,
    setVacations,
    individualVacationIsLoading,
    vacationPeriodsForIndividualVacation,
    employeesForReviewableVacations,
    currentUserVacationPeriods,
    loadMoreVacations,
    hasMoreVacations,
  };
};
