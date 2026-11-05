import { getUserTokenInfo } from './cookieUtils';

export const getTenantApiUrl = (
  baseURL = process.env.NEXT_PUBLIC_BACKEND_URL,
  tenant = getUserTokenInfo()?.tenant,
) => {
  if (!tenant?.trim()) {
    throw new Error('Tenant is required for tenant API requests.');
  }
  return baseURL?.replace(/api/, () => `${tenant}.api`);
};

export const domainAndSubdomains = `.${process.env.NEXT_PUBLIC_FRONTEND_URL?.split(
  '//',
)[1]?.replace(/\d+|:/g, '')}`;
