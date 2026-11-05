import { CookieValueTypes } from 'cookies-next';
import { HCTable } from 'types/HeadCount';
import axios from 'services/axios';
import { Currency, FilterOptionsForApi } from 'types';

export const HCReportRequest = async (
  token: CookieValueTypes,
  year: number,
  filterOptions?: FilterOptionsForApi[],
): Promise<HCTable> => {
  const res = await axios.post(
    `/team-headcount-and-cost-report/${year}`,
    {
      filter_options: filterOptions,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const HCReportExcel = async (
  token: CookieValueTypes,
  year: number,
  period: 'monthly' | 'quarterly',
  type: 'cost' | 'headcount',
  currency: Currency,
  filterOptions?: FilterOptionsForApi[],
) => {
  const res = await axios.post(
    `/team-headcount-and-cost-report-excel/${year}`,
    {
      filter_options: filterOptions,
      period,
      type,
      currency,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    },
  );
  return res;
};
