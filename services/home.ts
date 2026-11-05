import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';

export const getRevenueWidget = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  original: 1 | 0 = 0,
) => {
  const res = await axios.get(`/capacity-report?from=${from}&to=${to}&original=${original}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getBenchStats = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  original: 1 | 0 = 0,
) => {
  const res = await axios.get(`/bench-stats?from=${from}&to=${to}&original=${original}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUtilizationWidget = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  original: 1 | 0 = 0,
) => {
  const res = await axios.get(`/utilization?from=${from}&to=${to}&original=${original}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getRemindersWidget = async (token: CookieValueTypes, project_id?: number) => {
  const query = project_id ? `internal_project_id=${project_id}` : '';

  const res = await axios.get(`/dashboard-reminders?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getInvoiceWidget = async (token: CookieValueTypes) => {
  const res = await axios.get(`/dashboard-invoices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getBudgetWidget = async (token: CookieValueTypes, project_id?: number) => {
  const query = project_id ? `internal_project_id=${project_id}` : '';

  const res = await axios.get(`/dashboard-budgets?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
