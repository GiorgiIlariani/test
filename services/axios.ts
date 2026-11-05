import axios from 'axios';
import { GUEST_ROUTES_REGEX } from 'config';
import { getCookie } from 'cookies-next';
import { getTenantApiUrl, getUserTokenInfo } from 'helpers';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const impersonatingToken = getCookie('impersonation_token');

    if (impersonatingToken) {
      config.headers['X-Impersonation-Token'] = impersonatingToken;
    }

    const requestUrl = config.url;
    if (
      requestUrl &&
      GUEST_ROUTES_REGEX.some((regex) => regex.test(requestUrl)) &&
      !config.data?.tenant
    ) {
      config.baseURL = `${config.baseURL}central/`;
    } else {
      const token = config.headers.Authorization as string;
      const tenant = config.headers.tenant ?? getUserTokenInfo(token)?.tenant;
      config.baseURL = getTenantApiUrl(config.baseURL, tenant);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
