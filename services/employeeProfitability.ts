import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';
import { FilterOptionsForApi, PeopleHeadTypes } from 'types';
import {
  EmployeeProfitabilityHeadTypes,
  EmployeeProfitabilityStatisticsType,
} from 'types/employeeProfitability';

export const getProfitabilitySavedDateFilter = async (
  token: CookieValueTypes,
  signal?: AbortSignal,
): Promise<{
  dates: {
    endDate: string;
    startDate: string;
  };
}> => {
  const res = await axios.get('/profitability/date-filter', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return res.data;
};

export const getProfitability = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  termStatuses: string[],
  filterOptions?: FilterOptionsForApi[],
  sortBy?: PeopleHeadTypes | EmployeeProfitabilityHeadTypes,
  sortDirection?: 1 | 0,
  abortController?: AbortController,
): Promise<EmployeeProfitabilityStatisticsType> => {
  const res = await axios.post(
    '/profitability',
    {
      filter_options: filterOptions,
      sort_by: sortBy,
      sort_order: sortDirection,
      term_statuses: termStatuses,
    },
    {
      params: {
        start_date: from,
        end_date: to,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: abortController?.signal,
    },
  );
  return res.data;
};
