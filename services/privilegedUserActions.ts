import { AxiosResponse } from 'axios';
import axios from './axios';
import { CookieValueTypes } from 'cookies-next';
import { PrivilegedUserEditFormFields, PrivilegedUsers } from 'types';

export const getPrivilegedUsersListRequest = async (
  token: CookieValueTypes | string,
): Promise<
  AxiosResponse<{
    data: PrivilegedUsers[];
  }>
> => {
  return await axios.get('/admins', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editPrivilegedUserRequest = async (
  token: CookieValueTypes | string,
  id: number,
  data: PrivilegedUserEditFormFields,
): Promise<AxiosResponse<{ message: string }>> => {
  return await axios.put(`/admins/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePrivilegedUserRequest = async (
  token: CookieValueTypes,
  id: number,
): Promise<AxiosResponse<{ message: string }>> => {
  return await axios.delete(`/admins/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
