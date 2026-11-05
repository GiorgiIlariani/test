'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Currency, EmployeeFilterAndSortReducerDispatch, FilterOptions } from 'types';
import { getCookie } from 'cookies-next';
import {
  binFileDownloadHandler,
  formatFilterOptionsForBackend,
  getAllSubCategories,
  toastGeneralError,
} from 'helpers';
import { useForm } from 'react-hook-form';
import {
  HCEmployee,
  HCForm,
  HCPosition,
  HCSeniority,
  HCTable,
  MonthlyHCSortingState,
  QuarterlyHCSortingState,
} from 'types/HeadCount';
import { HCReportExcel, HCReportRequest } from 'services/headCount';
import { FULL_MONTH_NAMES, PARTIAL_QUARTER_NAMES } from 'config';

export const useHeadCountReport = (queryFilter: FilterOptions[]) => {
  const router = useRouter();
  const [year, setYear] = useState<number>(
    typeof router.query?.year === 'string' ? Number(router.query.year) : new Date().getFullYear(),
  );
  const [loading, setLoading] = useState(true);
  const [notResponseError, setNotResponseError] = useState(false);
  const [currency, setCurrency] = useState<Currency>('GEL');
  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(queryFilter);
  const [headCount, setHeadCount] = useState<HCTable>();
  const [excelButtonIsLoading, setExcelButtonIsLoading] = useState(false);
  const [sortingState, setSortingState] = useState<{
    quarterly: QuarterlyHCSortingState;
    monthly: MonthlyHCSortingState;
  }>({
    quarterly: PARTIAL_QUARTER_NAMES.map((quarter, i) => ({
      name: quarter,
      sortedBy: '',
      index: i,
      current: false,
    })),
    monthly: FULL_MONTH_NAMES.map((month, i) => ({
      name: month,
      sortedBy: '',
      index: i,
      current: false,
    })),
  });

  const form = useForm<HCForm>({
    defaultValues: {
      type: 'Headcount',
      period: 'monthly',
    },
    mode: 'onSubmit',
  });

  const getHCReport = async (argumentYear = year, argumentFilter = filterOptions) => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const filtersForApi = formatFilterOptionsForBackend(argumentFilter);
      const response = await HCReportRequest(
        getCookie('token'),
        argumentYear ?? currentYear,
        filtersForApi,
      );
      setHeadCount(response);
    } catch (error: any) {
      toastGeneralError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHCReport();
  }, []);

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

    await getHCReport(newYear);
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
        array: [
          {
            id: 'full-time',
            title: 'Full-time',
          },
          {
            id: 'part-time',
            title: 'Part-time',
          },
          {
            id: 'on-demand',
            title: 'On-demand',
          },
        ],
        type: 'availability',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
    );
  };

  const handleFilterChange: EmployeeFilterAndSortReducerDispatch = (value) => {
    const newFilter = value.type === 'CLEAR_ALL_FILTER' ? [] : value.payload?.filterOptions!;
    setFilterOptions(newFilter);
    getHCReport(year, newFilter);
  };

  const sortNested = (
    data: HCPosition[],
    period: 'monthly' | 'quarterly',
    type: 'Headcount' | 'Cost',
    monthIndex: number,
    currency: Currency = 'USD',
    direction: 'asc' | 'desc' = 'asc',
  ) => {
    const multiplier = direction === 'asc' ? 1 : -1;

    const monthKey =
      period === 'monthly'
        ? `${year}-${String(monthIndex + 1).padStart(2, '0')}`
        : `${year}-Q${monthIndex + 1}`;

    const getValue = (item: HCPosition | HCSeniority | HCEmployee) => {
      const periodKey = period === 'monthly' ? 'months' : 'quarters';
      if (type === 'Headcount') {
        return item[periodKey]?.[monthKey]?.headcount ?? 0;
      } else {
        return item[periodKey]?.[monthKey]?.costs?.[currency] ?? 0;
      }
    };

    const sortedPositions = [...data].sort(
      (a, b) => getValue(a) * multiplier - getValue(b) * multiplier,
    );

    sortedPositions.forEach((pos) => {
      pos.seniorities = pos.seniorities
        .sort((a, b) => getValue(a) * multiplier - getValue(b) * multiplier)
        .map((sen) => {
          if ('employees' in sen && sen.employees) {
            sen.employees = sen.employees.sort(
              (a, b) => getValue(a) * multiplier - getValue(b) * multiplier,
            );
          }

          if ('children' in sen && sen.children) {
            sen.children = sen.children
              .sort((a, b) => getValue(a) * multiplier - getValue(b) * multiplier)
              .map((child) => {
                if (child.employees) {
                  child.employees = child.employees.sort(
                    (a, b) => getValue(a) * multiplier - getValue(b) * multiplier,
                  );
                }
                return child;
              });
          }

          return sen;
        });
    });

    return sortedPositions;
  };

  const sortHeadCountReport = (index: number, latestType?: 'Headcount' | 'Cost') => {
    if (index < 0) return;
    setSortingState((prev) => {
      const period = form.getValues('period');

      let sortingState = {
        monthly: prev.monthly.map((item) => ({ ...item, current: false })),
        quarterly: prev.quarterly.map((item) => ({ ...item, current: false })),
      };

      sortingState[period as 'monthly' | 'quarterly'][index] = {
        index: sortingState[period][index].index,
        name: sortingState[period][index]?.name as unknown as (typeof FULL_MONTH_NAMES)[number],
        sortedBy: latestType
          ? sortingState[period as 'monthly' | 'quarterly'][index].sortedBy
          : sortingState[period as 'monthly' | 'quarterly'][index].sortedBy === 'asc'
          ? 'desc'
          : 'asc',
        current: true,
      };

      setHeadCount((prevHeadCount) => {
        if (!prevHeadCount) return prevHeadCount;

        const direction = sortingState[period][index].sortedBy === 'asc' ? 'asc' : 'desc';
        const type = latestType ?? form.getValues('type');

        return {
          ...prevHeadCount,
          monthly:
            period === 'monthly'
              ? sortNested(prevHeadCount.monthly, 'monthly', type, index, currency, direction)
              : prevHeadCount.monthly,
          quarterly:
            period === 'quarterly'
              ? sortNested(prevHeadCount.quarterly, 'quarterly', type, index, currency, direction)
              : prevHeadCount.quarterly,
        };
      });

      return sortingState;
    });
  };

  const getExcelHandler = async () => {
    const period = form.getValues('period').toLowerCase() as 'monthly' | 'quarterly';
    const type = form.getValues('type').toLowerCase() as 'headcount' | 'cost';

    const label = type === 'cost' ? 'Cost' : 'Headcount';
    const fileName = `${label} Report ${year}.xlsx`;

    setExcelButtonIsLoading(true);

    const token = getCookie('token');
    const filtersForApi = formatFilterOptionsForBackend(filterOptions);
    await binFileDownloadHandler(
      () => HCReportExcel(token, year, period, type, currency, filtersForApi),
      fileName,
      toastGeneralError,
    );

    setExcelButtonIsLoading(false);
  };

  return {
    currency,
    changeYear,
    year,
    loading,
    listOfYears,
    notResponseError,
    setNotResponseError,
    setCurrency,
    getAllSubCategoriesForFilter,
    filterOptions,
    setFilterOptions,
    handleFilterChange,
    form,
    headCount,
    sortHeadCountReport,
    sortingState,
    excelButtonIsLoading,
    getExcelHandler,
  };
};
