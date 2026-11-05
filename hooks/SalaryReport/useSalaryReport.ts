'use client';

import { useContext, useEffect, useState } from 'react';
import {
  Currency,
  EmployeeFilterAndSortReducerDispatch,
  FilterOptions,
  SavedFilterFromApi,
  SortingState,
  StaffMinimalEmployee,
} from 'types';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { CellData, SalaryAmountType, SalaryReport, SalaryViewType } from 'types/SalaryReport';
import { salaryReportExcel, salaryReportRequest } from 'services/salaryReport';
import {
  binFileDownloadHandler,
  formatFilterOptionsForBackend,
  getAllSubCategories,
  toastGeneralError,
} from 'helpers';
import { GlobalApiInfo } from 'context';
import { getMinimalUsers, getSavedFilterRequest } from 'services';
import { INCOME_HEADERS } from 'config';
import { useForm } from 'react-hook-form';

export const useSalaryReport = (queryFilter: FilterOptions[]) => {
  const router = useRouter();

  const initialViewType =
    typeof router.query?.view_type === 'string' &&
    ['actual', 'budget'].includes(router.query.view_type)
      ? (router.query.view_type as SalaryViewType)
      : 'actual';

  const initialSalaryAmountType =
    typeof router.query?.salary_amount_type === 'string' &&
    ['gross', 'net'].includes(router.query.salary_amount_type)
      ? (router.query.salary_amount_type as SalaryAmountType)
      : 'gross';

  const [year, setYear] = useState<number>(
    typeof router.query?.year === 'string' ? Number(router.query.year) : new Date().getFullYear(),
  );

  const [isBooked, setIsBooked] = useState(
    typeof router.query?.is_booked === 'string' && router.query.is_booked === 'true',
  );

  const [employees, setEmployees] = useState<SalaryReport>([]);
  const [loading, setLoading] = useState(true);
  const [notResponseError, setNotResponseError] = useState(false);
  const [currency, setCurrency] = useState<Currency>('GEL');
  const [filterEmployees, setFilterEmployees] = useState<StaffMinimalEmployee[]>();
  const [savedFiltersState, setSavedFiltersState] = useState<SavedFilterFromApi[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(queryFilter);
  const [sortingState, setSortingState] = useState<SortingState>(
    INCOME_HEADERS.map((month, i) => ({ name: month, sortedBy: '', index: i, current: false })),
  );
  const [excelButtonIsLoading, setExcelButtonIsLoading] = useState(false);
  const [isAddCareerLogModalOpen, setIsAddCareerLogModalOpen] = useState(false);
  const [isCareerLogFlowOpen, setIsCareerLogFlowOpen] = useState(false);
  const [cellData, setCellData] = useState<CellData | null>(null);

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      view_type: initialViewType,
      salary_amount_type: initialSalaryAmountType,
    },
  });

  const { departments, positions, rawSeniorities } = useContext(GlobalApiInfo);

  const getSalaryReport = async (
    argumentYear = year,
    argumentBooked = isBooked,
    argumentFilter = filterOptions,
  ) => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const filtersForApi = formatFilterOptionsForBackend(argumentFilter);
      const response = await salaryReportRequest(
        getCookie('token'),
        argumentYear ?? currentYear,
        argumentBooked ? 1 : 0,
        form.getValues('view_type'),
        form.getValues('salary_amount_type'),
        filtersForApi,
      );
      const sortIndex = sortingState.findIndex((item) => item.current);

      if (sortIndex >= 0) {
        sortEmployeeSalary(sortIndex, true, response, argumentYear);
      } else {
        setEmployees(response);
      }
    } catch (error: any) {
      toastGeneralError(error);
    } finally {
      setLoading(false);
    }
  };

  const getInitialReport = async () => {
    try {
      const [minimalUsers, savedFilters] = await Promise.all([
        getMinimalUsers(getCookie('token')),
        getSavedFilterRequest(getCookie('token'), '/reports/salary'),
        getSalaryReport(),
      ]);
      setFilterEmployees(minimalUsers.data);
      setSavedFiltersState(savedFilters);
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    getInitialReport();
  }, []);

  const changeViewType = () => {
    const viewType = form.getValues('view_type');

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          view_type: viewType,
        },
      },
      undefined,
      { shallow: true },
    );

    getSalaryReport(year, isBooked);
  };

  const changeSalaryAmountType = () => {
    const salaryAmountType = form.getValues('salary_amount_type');

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          salary_amount_type: salaryAmountType,
        },
      },
      undefined,
      { shallow: true },
    );

    getSalaryReport(year, isBooked);
  };

  const changeYear = async (newYear: number) => {
    setYear(newYear);

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          year: newYear,
        },
      },
      undefined,
      { shallow: true },
    );

    getSalaryReport(newYear, isBooked);
  };

  const changeBookedHandler = (isChecked: boolean) => {
    setIsBooked(isChecked);

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          is_booked: String(isChecked),
        },
      },
      undefined,
      { shallow: true },
    );

    getSalaryReport(year, isChecked);
  };

  const startYear = 2022;
  const endYear = new Date().getFullYear() + 1;
  const listOfYears = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => endYear - index,
  );

  const getAllSubCategoriesForFilter = () => {
    return getAllSubCategories(
      {
        array: departments?.filter((item) => item.is_billable),
        type: 'department',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'date',
      },
      {
        array: savedFiltersState?.map((el) => ({
          id: el.id,
          title: el.name,
          meta: {
            filters: el.filters,
            isPrivate: el.is_private,
            isMadeByThisUser: el.made_by_this_user,
          },
        })),
        filter_type: 'saved',
        shouldDefaultToAndInInsideCondition: false,
        type: 'saved',
      },
      {
        array: positions,
        type: 'job_title',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'date',
      },
      {
        array: [
          {
            id: 'employee',
            title: 'Employee',
          },
          {
            id: 'freelancer',
            title: 'Freelancer',
          },
        ],
        type: 'employment_type',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array:
          filterEmployees?.map((el) => ({
            id: el.id,
            first_name: el.name,
            last_name: '',
          })) ?? [],
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'employee',
      },
      {
        array: rawSeniorities,
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'seniority',
      },
    );
  };

  const handleFilterChange: EmployeeFilterAndSortReducerDispatch = (value) => {
    const newFilter = value.type === 'CLEAR_ALL_FILTER' ? [] : value.payload?.filterOptions!;
    setFilterOptions(newFilter);
    getSalaryReport(year, isBooked, newFilter);
  };

  const sortEmployeeSalary = (
    index: number,
    remainSortOrder: boolean = false,
    responseEmployees?: SalaryReport,
    argumentYear?: number,
  ) => {
    setEmployees((prev) => {
      const sorting = sortingState[index];
      const isYearly = index === 12;
      const currency = 'USD';
      const monthKey = `${argumentYear ?? year}-${String(index + 1).padStart(2, '0')}`;

      const sorted = (responseEmployees ? responseEmployees : [...prev]).sort((a, b) => {
        const aValue = isYearly
          ? a.yearly_total?.[currency] ?? 0
          : a.monthly?.[monthKey]?.[currency] ?? 0;
        const bValue = isYearly
          ? b.yearly_total?.[currency] ?? 0
          : b.monthly?.[monthKey]?.[currency] ?? 0;

        if (remainSortOrder) {
          return sorting.sortedBy === 'desc' ? aValue - bValue : bValue - aValue;
        }

        return sorting.sortedBy === 'asc' ? aValue - bValue : bValue - aValue;
      });

      return sorted;
    });

    setSortingState((prev) => {
      return prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            sortedBy: remainSortOrder ? item.sortedBy : item.sortedBy === 'asc' ? 'desc' : 'asc',
            current: true,
          };
        } else {
          return { ...item, current: false };
        }
      });
    });
  };

  const getExcelHandler = async () => {
    setExcelButtonIsLoading(true);
    const token = getCookie('token');
    const filtersForApi = formatFilterOptionsForBackend(filterOptions);
    await binFileDownloadHandler(
      () =>
        salaryReportExcel(
          token,
          year,
          isBooked ? 1 : 0,
          form.getValues('view_type'),
          form.getValues('salary_amount_type'),
          filtersForApi,
          currency,
        ),
      `salary-report-${year}.xlsx`,
      toastGeneralError,
    );
    setExcelButtonIsLoading(false);
  };

  const handleCellClick = (cellData: CellData) => {
    setIsCareerLogFlowOpen(true);
    setCellData(cellData);
  };

  const handleCloseCareerLogFlow = () => {
    setIsCareerLogFlowOpen(false);
    setCellData(null);
  };

  return {
    currency,
    changeYear,
    changeViewType,
    changeSalaryAmountType,
    year,
    loading,
    listOfYears,
    notResponseError,
    setNotResponseError,
    isBooked,
    changeBookedHandler,
    setCurrency,
    employees,
    getAllSubCategoriesForFilter,
    setSavedFiltersState,
    filterOptions,
    setFilterOptions,
    handleFilterChange,
    sortEmployeeSalary,
    sortingState,
    getExcelHandler,
    excelButtonIsLoading,
    isCareerLogFlowOpen,
    setIsCareerLogFlowOpen,
    getSalaryReport,
    form,
    cellData,
    handleCellClick,
    handleCloseCareerLogFlow,
    isAddCareerLogModalOpen,
    setIsAddCareerLogModalOpen,
  };
};
