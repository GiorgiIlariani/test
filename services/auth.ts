import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';

export const loginRequest = async (data: {
  email: string;
  password: string;
  'remember-me': boolean;
}): Promise<
  AxiosResponse<
    {
      message: 'Email sent';
    },
    any
  >
> => {
  const res = await axios.post('/login', data);
  return res;
};

export const logOutRequest = async (token: CookieValueTypes) => {
  await axios.post('/logout', null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
