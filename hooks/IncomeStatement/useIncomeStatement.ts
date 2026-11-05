'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Currency,
  CurrencyConfig,
  IncomeStatement,
  IncomeStatementEmployee,
  ParentRowData,
  SortingState,
} from 'types';
import {
  convertAndSumIncome,
  createSortedArrayFromObject,
  getUser,
  parentRowDefaultSort,
} from './helpers';
import { getApplicationConfigs, getIncomeStatementRequest } from 'services';
import { getCookie } from 'cookies-next';
import { getUserTokenInfo, toastGeneralError } from 'helpers';
import { GlobalApiInfo } from 'context';
import { INCOME_HEADERS } from 'config';
import { useRouter } from 'next/router';

export const useIncomeStatement = () => {
  const router = useRouter();
  const [year, setYear] = useState<number>(
    typeof router.query?.year === 'string' ? Number(router.query.year) : new Date().getFullYear(),
  );
  const [income, setIncome] = useState<IncomeStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notResponseError, setNotResponseError] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [sortingState, setSortingState] = useState<SortingState>(
    INCOME_HEADERS.map((month, i) => ({ name: month, sortedBy: '', index: i, current: false })),
  );
  const [orderOfParentRow] = useState<ParentRowData[]>(parentRowDefaultSort);
  const [originalIncome, setOriginalIncome] = useState<IncomeStatement[]>([]);
  const [currency, setCurrency] = useState<Currency>('GEL');

  const withBooked = isBooked ? 1 : 0;

  const { departments } = useContext(GlobalApiInfo);

  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>({
    currency: 'GEL',
    all_currencies: ['GEL', 'USD', 'GBP', 'EUR'],
  });

  const changeBookedHandler = (isChecked: boolean) => {
    setIsBooked(isChecked);
    setIncomeStatement(isChecked ? 1 : 0, 1);
  };

  const getIncomeStatement = async (
    isBooked: 1 | 0 = 0,
    cached: 0 | 1 = 1,
    year?: number,
    abortController?: AbortController,
  ) => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await getIncomeStatementRequest(
        getCookie('token'),
        year ?? currentYear,
        isBooked,
        cached,
      );

      return response;
    } catch (error: any) {
      if (abortController?.signal.aborted) return;
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  const setIncomeStatement = useCallback(
    async (
      isBooked: 0 | 1 = 0,
      cached: 0 | 1 = 1,
      latestCurrencyConfig?: CurrencyConfig,
      latestCurrency?: Currency,
      abortController?: AbortController,
    ) => {
      setLoading(true);
      try {
        const response = await getIncomeStatement(isBooked, cached, year, abortController);
        setOriginalIncome(structuredClone(response));
        setIncome(
          convertAndSumIncome(
            response,
            latestCurrency ?? currency,
            latestCurrencyConfig?.currency ?? currencyConfig.currency,
          ),
        );
      } catch (error: any) {
        if (abortController?.signal.aborted) return;
        error.response ? toastGeneralError(error) : setNotResponseError(true);
      } finally {
        setLoading(false);
      }
    },
    [year, currency, currencyConfig],
  );

  const getInitialIncome = async (abortController: AbortController) => {
    const applicationConfig = await getApplicationConfigs(getCookie('token'));
    setCurrencyConfig(applicationConfig.currency);
    const tenant = getUserTokenInfo()?.tenant;
    const user = await getUser();
    const latestCurrency =
      (getCookie(`${tenant}-${user?.id}-currency`) as Currency) ?? currencyConfig.currency;
    setIncomeStatement(withBooked, 1, applicationConfig.currency, latestCurrency, abortController);
  };

  useEffect(() => {
    const abortController = new AbortController();
    getInitialIncome(abortController);
    return () => {
      abortController.abort();
    };
  }, []);

  const sortIncomeStatement = (
    index: number,
    income?: IncomeStatement[],
    sortedBy?: 'asc' | 'desc' | '',
  ) => {
    setSortingState((prev) => {
      let sortingState = [...prev.map((item) => ({ ...item, current: false }))];
      sortingState[index] = {
        index: sortingState[index].index,
        name: sortingState[index]?.name as unknown as (typeof INCOME_HEADERS)[number],
        sortedBy: sortedBy ? sortedBy : sortingState[index].sortedBy === 'asc' ? 'desc' : 'asc',
        current: true,
      };

      setIncome((previous) => {
        const prev = income ?? previous;

        let newState = [...prev];

        orderOfParentRow.forEach((item) => {
          if (item.row !== 'other_than_project_cogs' && item.row !== 'total_admin_costs') {
            newState[index][item.row] = {
              ...newState[index][item.row],
              projects: newState[index][item.row].projects
                ?.sort((a, b) =>
                  sortingState[index].sortedBy === 'asc' ? a.total - b.total : b.total - a.total,
                )
                .map((project, indx) => ({ ...project, index: indx })),
            };

            const sortIndexMap = {} as { [key: string]: number };
            newState[index][item.row].projects?.forEach((item) => {
              sortIndexMap[item.id] = item.index!;
            });

            newState.forEach((el, i) => {
              (newState[i][item.row] as IncomeStatement['revenue']) = {
                ...newState[i][item.row],
                projects: (newState[i][item.row] as IncomeStatement['revenue']).projects
                  ?.sort((a, b) => sortIndexMap[a.id] - sortIndexMap[b.id])
                  .map((project) => {
                    const employeesKeys = createSortedArrayFromObject(
                      project.employees as Record<string, IncomeStatementEmployee>,
                      sortingState[index].sortedBy,
                    );

                    return { ...project, employeesKeys };
                  }),
              };
            });
          } else if (item.row === 'other_than_project_cogs') {
            newState.forEach((el, i) => {
              const row = newState[i][item.row] as IncomeStatement['other_than_project_cogs'];

              const fullyBenchedEmployees =
                row['cost_of_bench']['employees_fully_on_bench'].employees;

              const fullyBenchedEmployeesKeys = createSortedArrayFromObject(
                fullyBenchedEmployees as Record<string, IncomeStatementEmployee>,
                sortingState[i].sortedBy,
              );

              row['cost_of_bench']['employees_fully_on_bench'] = {
                ...row['cost_of_bench']['employees_fully_on_bench'],
                employeesKeys: fullyBenchedEmployeesKeys,
              };

              const partiallyBenchedEmployees =
                row['cost_of_bench']['employees_partially_on_bench'].employees;

              const partiallyBenchedEmployeesKeys = createSortedArrayFromObject(
                partiallyBenchedEmployees as Record<string, IncomeStatementEmployee>,
                sortingState[i].sortedBy,
              );

              row['cost_of_bench']['employees_partially_on_bench'] = {
                ...row['cost_of_bench']['employees_partially_on_bench'],
                employeesKeys: partiallyBenchedEmployeesKeys,
              };

              const releasedEmployeesEmployees = row['cost_of_released'].employees;

              const releasedEmployeesEmployeesKeys = createSortedArrayFromObject(
                releasedEmployeesEmployees as Record<string, IncomeStatementEmployee>,
                sortingState[i].sortedBy,
              );

              row['cost_of_released'] = {
                ...row['cost_of_released'],
                employeesKeys: releasedEmployeesEmployeesKeys,
              };
            });
          }
        });
        return newState;
      });

      return sortingState;
    });
  };

  const changeCurrency = (newCurrency: string) => {
    if (newCurrency === currency) return;
    const sortValues = sortingState.find((item) => item.current);
    if (sortValues) {
      sortIncomeStatement(
        sortValues.index,
        convertAndSumIncome(originalIncome, newCurrency as Currency, currencyConfig.currency),
        sortValues.sortedBy,
      );
    } else {
      setIncome(
        convertAndSumIncome(originalIncome, newCurrency as Currency, currencyConfig.currency),
      );
    }
  };

  const changeYear = async (newYear: number) => {
    setLoading(true);
    try {
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
      const income = await getIncomeStatement(withBooked, 1, newYear);

      const sortValues = sortingState.find((item) => item.current);
      setOriginalIncome(structuredClone(income));

      if (sortValues) {
        sortIncomeStatement(
          sortValues.index,
          convertAndSumIncome(income, currency, currencyConfig.currency),
          sortValues.sortedBy,
        );
      } else {
        setIncome(convertAndSumIncome(income, currency, currencyConfig.currency));
      }
    } catch (error: any) {
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    } finally {
      setLoading(false);
    }
  };

  const startYear = 2022;
  const endYear = new Date().getFullYear() + 1;
  const listOfYears = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => endYear - index,
  );

  const getFreshDate = () => {
    setIncomeStatement(withBooked, 0);
  };

  return {
    currency,
    changeCurrency,
    year,
    changeYear,
    income,
    setIncome,
    loading,
    departments,
    listOfYears,
    notResponseError,
    setNotResponseError,
    isBooked,
    changeBookedHandler,
    setSortingState,
    sortingState,
    sortIncomeStatement,
    orderOfParentRow,
    getFreshDate,
    currencyConfig,
    setOriginalIncome,
    setCurrency,
  };
};
