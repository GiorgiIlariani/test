import { axios } from 'services';
import { CookieValueTypes } from 'cookies-next';
import {
  ProjectDashboard,
  ProjectForm,
  StaffMinimalEmployee,
  TimeSheetTableInitial,
  ProjectInvoicesBudget,
  BudgetTotals,
  ClientDetail,
  ClientSummary,
  ClientRequestValues,
  DeleteClientPayload,
} from 'types';
import qs from 'qs';
import { AddProjectFormValues } from 'schemas';
import { serializeClientRequest } from 'helpers';

export const getMinimalUsers = async (
  token: CookieValueTypes | string,
  withArchived: 1 | 0 = 0,
  signal?: AbortSignal,
): Promise<{
  data: StaffMinimalEmployee[];
}> => {
  const res = await axios.get('/minimal-users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      with_archived: withArchived,
    },
    signal,
  });
  return res.data;
};

export const getProjectsIndex = async (
  token: CookieValueTypes | string,
  statuses: string[],
): Promise<ProjectDashboard[]> => {
  const res = await axios.get('/internal-projects', {
    params: { statuses },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAllProjects = async (
  token: CookieValueTypes | string,
): Promise<ProjectDashboard[]> => {
  const res = await axios.get('/info/internal-projects', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const postInternalProject = async (
  token: CookieValueTypes | string,
  data: AddProjectFormValues,
): Promise<ProjectDashboard> => {
  const res = await axios.post('/internal-projects', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const putInternalProject = async (
  token: CookieValueTypes | string,
  data: AddProjectFormValues,
  id: string | number,
): Promise<ProjectForm> => {
  const res = await axios.post(`/internal-projects/${id}?_method=put`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getProject = async (
  token: CookieValueTypes | string,
  id: number,
): Promise<{ data: ProjectForm }> => {
  const res = await axios.get(`/internal-projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getProjectPlan = async (
  token: CookieValueTypes | string,
  id: number,
  inProjectCurrency: 1 | 0 = 0,
): Promise<{ data: ProjectForm }> => {
  const res = await axios.get(
    `/internal-projects/plan/${id}?in_project_currency=${inProjectCurrency}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const deleteProject = async (
  token: CookieValueTypes | string,
  projectId: string | number,
) => {
  const res = await axios.delete(`/internal-projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteTerm = async (token: CookieValueTypes | string, termId: number) => {
  const res = await axios.delete(`/terms/${termId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getProjectManagers = async (
  token: CookieValueTypes | string,
  signal?: AbortSignal,
) => {
  const res = await axios.get('/project-managers', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return res.data;
};

export const getProjectTitlesRequest = async (token: CookieValueTypes | string) => {
  const res = await axios.get('/internal-projects/titles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getProjectClientsRequest = async (
  token: CookieValueTypes | string,
  signal?: AbortSignal,
): Promise<ClientSummary[]> => {
  const res = await axios.get('/clients', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return res.data.data;
};

export const getClientDetailsRequest = async (
  token: CookieValueTypes | string,
  clientId: number,
): Promise<ClientDetail> => {
  const res = await axios.get(`/clients/${clientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const storeProjectClientRequest = async (
  token: CookieValueTypes | string,
  data: ClientRequestValues,
): Promise<ClientDetail> => {
  const res = await axios.post('/clients', serializeClientRequest(data), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.data;
};

export const updateClientRequest = async (
  token: CookieValueTypes | string,
  data: ClientRequestValues,
  clientId: number,
): Promise<ClientDetail> => {
  const res = await axios.post(`/clients/${clientId}?_method=put`, serializeClientRequest(data), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.data;
};

export const deleteClientRequest = async (
  token: CookieValueTypes | string,
  clientId: number,
  data?: DeleteClientPayload,
): Promise<{ message: string }> => {
  const res = await axios.delete(`/clients/${clientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });

  return res.data;
};

export const getProjectDashboard = async (
  token: CookieValueTypes,
  project: number,
): Promise<TimeSheetTableInitial> => {
  const res = await axios.get(`/internal-projects/dashboard/${project}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getProjectRevenueRequest = async (
  token: CookieValueTypes,
  project: number,
): Promise<ProjectDashboard> => {
  const res = await axios.get(`/internal-projects/project-revenue/${project}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getInvoicesBudget = async (
  token: CookieValueTypes,
  project: number,
): Promise<ProjectInvoicesBudget> => {
  const res = await axios.get(`/internal-projects/invoice-finances/${project}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getProjectRevenue = async (
  token: CookieValueTypes,
  from: string,
  to: string,
  project: number,
  initial: 1 | 0 = 0,
) => {
  const res = await axios.get(
    `/internal-projects/revenue/${project}?from=${from}&to=${to}&initial=${initial}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getProjectTotals = async (
  token: CookieValueTypes,
  project: number,
): Promise<BudgetTotals[]> => {
  const res = await axios.get(`/internal-projects/totals/${project}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
