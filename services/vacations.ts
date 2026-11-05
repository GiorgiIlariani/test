import { CookieValueTypes } from 'cookies-next';
import { axios } from 'services';
import {
  EmployeeVacations,
  VacationsArray,
  StaffingAndTermVacation,
  FilterOptionsForApi,
} from 'types';

export const getReviewers = async (token: CookieValueTypes) => {
  const res = await axios.get('/reviewers', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getVacationPeriodsForUser = async (
  token: CookieValueTypes,
  id: number,
  year: number,
) => {
  const res = await axios.get(`vacation-periods-for/${id}/${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getDefaultReviewers = async (
  token: CookieValueTypes,
  id: number,
  startDate: string,
  endDate: string,
): Promise<
  {
    id: number;
    required: boolean;
  }[]
> => {
  const res = await axios.get(`/default-reviewers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
  return res.data;
};

export const postVacationsRequest = async (
  token: CookieValueTypes,
  data: FormData,
): Promise<EmployeeVacations[]> => {
  const res = await axios.post('/vacations', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getVacationsDashboard = async (
  year: number,
  token: CookieValueTypes,
  pageIndex: number | string,
  filterOptions?: FilterOptionsForApi[],
) => {
  const res = await axios.post(
    `/vacations/${year}?page=${pageIndex}`,
    { filter_options: filterOptions },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getVacationsForReview = async (token: CookieValueTypes) => {
  const res = await axios.get(`/vacations-for-review`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getVacationsExcel = async (
  token: CookieValueTypes,
  year: number,
  filterOptions?: FilterOptionsForApi[],
) => {
  const res = await axios.post(
    `/vacations/${year}/excel`,
    { filter_options: filterOptions },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    },
  );
  return res;
};

export const approveVacation = async (id: number, token: CookieValueTypes) => {
  const res = await axios.post(
    `/vacations-approve`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const postReviewerFields = async (id: number, data: any, token: CookieValueTypes) => {
  const res = await axios.post(`/vacations/update-additional-fields/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const updateVacation = async (
  id: number,
  data: FormData,
  token: CookieValueTypes,
): Promise<VacationsArray> => {
  const res = await axios.post(`/vacations/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

export const rejectVacation = async (id: number, token: CookieValueTypes) => {
  const res = await axios.patch(
    `/reject-vacation/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getUsersFromSameDepartment = async (user: number, token: CookieValueTypes) => {
  const res = await axios.get(`/vacation-fallback-employees/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getVacation = async (
  vacationId: number,
  token: CookieValueTypes,
): Promise<{ data: VacationsArray }> => {
  const res = await axios.get(`/get-vacation/${vacationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteVacationRequest = async (vacationId: number, token: CookieValueTypes) => {
  const res = await axios.delete(`vacations/${vacationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteVacationReviewRequest = async (
  vacationId: number,
  token: CookieValueTypes,
  data: {
    review: 'approved' | 'rejected';
  },
) => {
  const res = await axios.delete(`/vacation-review-delete/${vacationId}`, {
    params: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getEmployeeTimeOffsRequest = async (
  data: {
    id?: number | string;
    from: string;
    to: string;
    staffs: string[];
  },
  token: CookieValueTypes,
): Promise<{
  data: StaffingAndTermVacation[];
}> => {
  const res = await axios.post('/employee-time-offs', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
