import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';
import { Currency, FilterOptionsForApi } from 'types';
import { SalaryAmountType, SalaryReport, SalaryViewType } from 'types/SalaryReport';

export const salaryReportRequest = async (
  token: CookieValueTypes,
  year: number,
  include_booked_terms: 0 | 1,
  view_type: SalaryViewType,
  salary_amount_type: SalaryAmountType,
  filterOptions?: FilterOptionsForApi[],
): Promise<SalaryReport> => {
  const res = await axios.post(
    `/salary-report/${year}`,
    {
      filter_options: filterOptions,
      include_booked_terms: include_booked_terms,
      view_type,
      salary_amount_type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const salaryReportExcel = async (
  token: CookieValueTypes,
  year: number,
  include_booked_terms: 0 | 1,
  view_type: SalaryViewType,
  salary_amount_type: SalaryAmountType,
  filterOptions?: FilterOptionsForApi[],
  currency?: Currency,
) => {
  const res = await axios.post(
    `/salary-report-excel/${year}`,
    {
      filter_options: filterOptions,
      include_booked_terms: include_booked_terms,
      currency: currency,
      view_type,
      salary_amount_type,
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
