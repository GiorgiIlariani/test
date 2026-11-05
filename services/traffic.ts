import { CookieValueTypes } from 'cookies-next';
import { axios } from 'services';
import {
  FilterOptionsForApi,
  PeopleHeadTypes,
  PeopleTraffic,
  ProjectHeadTypes,
  ProjectsTraffic,
  TimeOffHeadType,
  TimeOffTraffic,
  TrafficStatisticsType,
} from 'types';
import { EmployeeProfitabilityHeadTypes } from 'types/employeeProfitability';

export const getProjectsTraffic = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  termStatuses: string[],
  filterOptions?: FilterOptionsForApi[],
  sortBy?: ProjectHeadTypes,
  sortDirection?: 1 | 0,
  abortController?: AbortController,
): Promise<ProjectsTraffic[]> => {
  const res = await axios.post(
    '/traffic/projects',
    {
      filter_options: filterOptions,
      sort_by: sortBy,
      sort_order: sortDirection,
      term_statuses: termStatuses,
    },
    {
      params: {
        from: from,
        to: to,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: abortController?.signal,
    },
  );
  return res.data;
};

export const getTimeOffTraffic = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  termStatuses: string[],
  filterOptions?: FilterOptionsForApi[],
  sortBy?: TimeOffHeadType,
  sortDirection?: 1 | 0,
  abortController?: AbortController,
): Promise<TimeOffTraffic> => {
  const res = await axios.post(
    '/traffic/time-off',
    {
      filter_options: filterOptions,
      sort_by: sortBy,
      sort_order: sortDirection,
      term_statuses: termStatuses,
    },
    {
      params: {
        from: from,
        to: to,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: abortController?.signal,
    },
  );
  return res.data;
};

export const getPeopleTraffic = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  termStatuses: string[],
  filterOptions?: FilterOptionsForApi[],
  sortBy?: PeopleHeadTypes | EmployeeProfitabilityHeadTypes,
  sortDirection?: 1 | 0,
  abortController?: AbortController,
): Promise<PeopleTraffic[]> => {
  const res = await axios.post(
    '/traffic/users',
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

export const getTrafficSavedDateFilter = async (
  token: CookieValueTypes,
  signal?: AbortSignal,
): Promise<{
  dates: {
    endDate: string;
    startDate: string;
  };
}> => {
  const res = await axios.get('/traffic/date-filter', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return res.data;
};

export const getTrafficStatistics = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  termStatuses: string[],
  filterOptions?: FilterOptionsForApi[],
  abortController?: AbortController,
): Promise<TrafficStatisticsType> => {
  const res = await axios.post(
    '/traffic',
    {
      filter_options: filterOptions,
      term_statuses: termStatuses,
    },
    {
      params: {
        from: from,
        to: to,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: abortController?.signal,
    },
  );
  return res.data;
};

export const generateTrafficCSV = async (
  token: CookieValueTypes,
  from: Date,
  to: Date,
  termStatus: string[],
  filterOptions?: FilterOptionsForApi[],
) => {
  const res = await axios.post(
    '/traffic/generate-csv',
    {
      filter_options: filterOptions,
      term_statuses: termStatus,
    },
    {
      params: {
        start_date: from,
        end_date: to,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
