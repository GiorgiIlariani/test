import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';
import { OtherExpense, OtherExpenseResponse } from 'types';

export const getOtherExpenses = async (
  token: CookieValueTypes | string,
  year: number,
): Promise<OtherExpenseResponse[]> => {
  const res = await axios.get(`other-expenses-records/${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getOtherExpansesTitles = async (
  token: CookieValueTypes | string,
): Promise<{ data: { title: string; id: number }[] }> => {
  const res = await axios.get(`other-expenses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createOtherExpenseTitle = async (token: CookieValueTypes | string, title: string) => {
  const res = await axios.post(
    `other-expenses`,
    { title },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const createOtherExpenseEntry = async (
  token: CookieValueTypes | string,
  data: OtherExpense,
) => {
  const res = await axios.post(
    `other-expenses-records`,
    { ...data },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const updateOtherExpenseTitle = async (
  token: CookieValueTypes | string,
  data: OtherExpense,
  id: number,
) => {
  const res = await axios.post(
    `other-expenses-records/${id}`,
    { ...data },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getOtherAdminExpenses = async (
  token: CookieValueTypes | string,
  year: number,
): Promise<OtherExpenseResponse[]> => {
  const res = await axios.get(`other-expenses-admin-records/${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getIncomeStatementRequest = async (
  token: CookieValueTypes,
  year: number,
  include_booked_terms: 0 | 1,
  cached: 0 | 1 = 1,
) => {
  const res = await axios.get('/income-statement', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      year,
      include_booked_terms,
      cached: cached,
    },
  });

  return res.data;
};

export const deleteExpenseRecord = async (token: CookieValueTypes, id: number) => {
  const res = await axios.delete(`/other-expenses-records/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteExpenseRow = async (token: CookieValueTypes, data: { ids: number[] }) => {
  const res = await axios.delete(`/other-expenses-records-row`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });

  return res.data;
};
