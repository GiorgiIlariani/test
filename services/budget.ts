import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';
import { BudgetApi, BudgetForm, PhasesForm, BudgetTotals } from 'types';

export const getAllBudgets = async (
  token: CookieValueTypes | string,
  status: string,
  with_recent: 1 | 0 = 1,
): Promise<BudgetApi> => {
  const res = await axios.get(`/budgets`, {
    params: {
      status,
      with_recent,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getBudget = async (
  token: CookieValueTypes | string,
  budgetId: number,
): Promise<BudgetForm> => {
  const res = await axios.get(`/budgets/${budgetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const getBudgetTotals = async (
  token: CookieValueTypes | string,
  budgetId: number | string,
  draft?: boolean,
): Promise<BudgetTotals> => {
  const res = await axios.get(`/budgets/totals/${budgetId}`, {
    params: {
      is_draft: !!draft,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateRatesBasedOnSubtotal = async (
  token: CookieValueTypes | string,
  budgetId: number | string,
  total: number,
  termId: string | number | null = null,
): Promise<BudgetTotals> => {
  const res = await axios.post(
    `/budgets/rates/${budgetId}`,
    {
      total: total,
      term_id: termId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const temporaryUpdateRatesBasedOnSubtotal = async (
  token: CookieValueTypes | string,
  budgetId: number | string,
  total: number,
  termId: string | number | null = null,
): Promise<BudgetTotals> => {
  const res = await axios.post(
    `/budgets/temporary-rates/${budgetId}`,
    {
      total: total,
      term_id: termId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const temporaryUpdateRatesBasedOnMonthly = async (
  token: CookieValueTypes | string,
  budgetId: number | string,
  monthly_fee: number,
  termId: string | number | null = null,
): Promise<BudgetTotals> => {
  const res = await axios.post(
    `/budgets/temporary-monthly-rates/${budgetId}`,
    {
      monthly_fee: monthly_fee,
      term_id: termId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const updateRatesBasedOnMonthly = async (
  token: CookieValueTypes | string,
  budgetId: number | string,
  monthly_fee: number,
  termId: string | number | null = null,
): Promise<BudgetTotals> => {
  const res = await axios.post(
    `/budgets/monthly-rates/${budgetId}`,
    {
      monthly_fee: monthly_fee,
      term_id: termId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const archiveBudget = async (
  token: CookieValueTypes | string,
  budgetId: number | string,
) => {
  const res = await axios.post(`/budgets/archive/${budgetId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const unarchiveBudget = async (
  token: CookieValueTypes | string,
  budgetId: number | string,
) => {
  const res = await axios.post(`/budgets/unarchive/${budgetId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteBudget = async (token: CookieValueTypes | string, budgetId: string | number) => {
  const res = await axios.delete(`/budgets/${budgetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createBudget = async (token: CookieValueTypes | string, budget: BudgetForm) => {
  const res = await axios.post(`/budget`, budget, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const storeDerivedBudget = async (
  token: CookieValueTypes | string,
  projectId: number,
  title: string,
) => {
  const res = await axios.post(
    `/budget/store-derived-budget`,
    {
      internal_project_id: projectId,
      title,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const editBudget = async (
  token: CookieValueTypes | string,
  budgetId: number,
  budget: BudgetForm,
) => {
  const res = await axios.patch(`/budget/${budgetId}`, budget, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const editBudgetTerms = async (
  token: CookieValueTypes | string,
  budgetId: number,
  budget: { terms: PhasesForm[] },
) => {
  const res = await axios.post(`/budgets/terms/${budgetId}`, budget, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const activateTerm = async (token: CookieValueTypes | string, termId: number) => {
  const res = await axios.post(
    `/terms/activate/${termId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const createPhase = async (token: CookieValueTypes | string, budgetId: number) => {
  const res = await axios.post(
    `/budgets/term/${budgetId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const movePhases = async (
  token: CookieValueTypes | string,
  budgetId: number,
  termIds: number[],
) => {
  const res = await axios.post(
    `/budgets/move-term/${budgetId}`,
    { terms: termIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getBudgetingPhases = async (
  token: CookieValueTypes | string,
  budgetId: number,
  draft?: boolean,
): Promise<PhasesForm[]> => {
  const res = await axios.get(`/budgets/terms/${budgetId}`, {
    params: {
      is_draft: !!draft,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const deleteBudgetTerm = async (
  token: CookieValueTypes | string,
  termId: number,
): Promise<PhasesForm[]> => {
  const res = await axios.delete(`/budgets/terms/${termId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const temporaryEditBudgetPhases = async (
  token: CookieValueTypes | string,
  budgetId: number,
  budget: {
    terms: PhasesForm[];
    rate_card_id: number;
    update_term_status: boolean;
    internal_project_id: number | null;
    are_public_holidays_counted: boolean;
  },
) => {
  const res = await axios.post(`/budgets/temporary-terms/${budgetId}`, budget, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const temporaryEditBudget = async (
  token: CookieValueTypes | string,
  budgetId: number,
  budget: BudgetForm,
) => {
  const res = await axios.post(`/budgets/temporary-update/${budgetId}`, budget, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const savePublishedBudget = async (
  token: CookieValueTypes | string,
  budgetId: number,
  budget: BudgetForm,
) => {
  const res = await axios.post(`/budgets/save-temporary-terms/${budgetId}`, budget, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
