import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';
import {
  Currency,
  Department,
  ListType,
  Position,
  PositionSeniority,
  SectionNames,
  Seniority,
  Skill,
  ActionTypes,
} from 'types';

export const getPositionsRequest = async (
  token: CookieValueTypes | string,
): Promise<AxiosResponse<Position[], any>> => {
  const res = await axios.get('/positions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createPositionRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<ListType, any>> => {
  const res = await axios.post('/positions', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updatePositionRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<Position, any>> => {
  const res = await axios.post(`/positions/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deletePositionRequest = async (
  token: CookieValueTypes,
  id: number,
): Promise<AxiosResponse<Position, any>> => {
  const res = await axios.delete(`/positions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const reorderPositionRequest = async (
  token: CookieValueTypes,
  new_order: number,
  position: number,
): Promise<AxiosResponse<Department[], any>> => {
  const res = await axios.post(
    `/positions/${position}/reorder`,
    { new_order },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getDepartmentsRequest = async (
  token: CookieValueTypes,
): Promise<AxiosResponse<Department[], any>> => {
  const res = await axios.get('/departments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createDepartmentRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<ListType, any>> => {
  const res = await axios.post('/departments', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateDepartmentRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<Department, any>> => {
  const res = await axios.post(`/departments/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteDepartmentRequest = async (
  token: CookieValueTypes,
  id: number,
): Promise<AxiosResponse<Department, any>> => {
  const res = await axios.delete(`/departments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const reorderDepartmentRequest = async (
  token: CookieValueTypes,
  new_order: number,
  department: number,
): Promise<AxiosResponse<Department[], any>> => {
  const res = await axios.post(
    `/departments/${department}/reorder`,
    { new_order },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getSenioritiesRequest = async (
  token: CookieValueTypes,
): Promise<AxiosResponse<Seniority[], any>> => {
  const res = await axios.get('/seniorities', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getGlobalRoles = async (
  token: CookieValueTypes | string,
): Promise<{ data: PositionSeniority[] }> => {
  const res = await axios.get('/global-roles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createSeniorityRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<ListType, any>> => {
  const res = await axios.post('/seniorities', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateSeniorityRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<Seniority, any>> => {
  const res = await axios.post(`/seniorities/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteSeniorityRequest = async (token: CookieValueTypes, id: number) => {
  const res = await axios.delete(`/seniorities/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const reorderSeniorityRequest = async (
  token: CookieValueTypes,
  new_order: number,
  seniority: number,
  parent_id?: number,
): Promise<AxiosResponse<Department[], any>> => {
  const res = await axios.post(
    `/seniorities/${seniority}/reorder`,
    { new_order, parent_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getSkillsRequest = async (
  token: CookieValueTypes,
): Promise<AxiosResponse<Skill[], any>> => {
  const res = await axios.get('/skills', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createSkillRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<ListType, any>> => {
  const res = await axios.post('/skills', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateSkillRequest = async (
  token: CookieValueTypes,
  data: ListType,
): Promise<AxiosResponse<Skill, any>> => {
  const res = await axios.post(`/skills/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteSkillRequest = async (token: CookieValueTypes, id: number) => {
  const res = await axios.delete(`/skills/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const reorderSkillRequest = async (
  token: CookieValueTypes,
  new_order: number,
  skill: number,
): Promise<AxiosResponse<Skill[], any>> => {
  const res = await axios.post(
    `/skills/${skill}/reorder`,
    { new_order },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getUsersDataPerSetting = async (
  token: CookieValueTypes,
  section: SectionNames,
  id: number,
) => {
  let type: string = section;
  if (section === 'titles') {
    type = 'position';
  }
  const res = await axios.get(`/users-with-certain-user-data?data_type=${type}&data_id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUsersDataPerSkill = async (token: CookieValueTypes, id: number) => {
  const res = await axios.get(`users-with-certain-skills/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getIndustriesRequest = async (token: CookieValueTypes | string): Promise<string[]> => {
  const res = await axios.get('/industries', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getRoles = async (token: CookieValueTypes | string) => {
  const res = await axios.get('/roles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getJobTypes = async (token: CookieValueTypes) => {
  const res = await axios.get('job-types', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getCareerHistoryTypes = async (token: CookieValueTypes): Promise<ActionTypes[]> => {
  const res = await axios.get('career-history-types', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getCurrencyRatesRequest = async (
  token: CookieValueTypes,
): Promise<{ [key in Currency]: number }> => {
  const res = await axios.get('/currency-rates', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
