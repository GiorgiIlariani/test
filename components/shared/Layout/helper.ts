import { deleteCookie, getCookie } from 'cookies-next';
import { domainAndSubdomains } from 'helpers';
import { NextRouter } from 'next/router';
import { logOutRequest } from 'services';

export const logOutHandler = async (router: NextRouter | null = null) => {
  const token = getCookie('token');
  await logOutRequest(token);

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  deleteCookie('tenant-url', {
    domain: domainAndSubdomains,
  });
  deleteCookie('token');
  deleteCookie('end-user');
  deleteCookie('role');
  deleteCookie('remember_me', {
    domain: domainAndSubdomains,
  });
  deleteCookie('impersonation_token');

  router && router.replace(`${baseUrl}/login`);
};
