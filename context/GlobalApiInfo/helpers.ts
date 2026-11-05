import { REQUIRED_INFO_FOR_PAGES } from 'config';
import { CookieValueTypes, getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';

export const shouldResourceBeLoadedOnPage = async <T>(
  pathname: string,
  resourceName: keyof typeof REQUIRED_INFO_FOR_PAGES,
  resourceExists: boolean,
  callback: (token: CookieValueTypes) => Promise<T>,
  shouldBeAuthorized?: boolean,
) => {
  if (resourceExists) {
    return false;
  }
  const routesResourceIsRequiredFor = REQUIRED_INFO_FOR_PAGES[resourceName];
  const resourceIsRequiredOnRoute = routesResourceIsRequiredFor.some((route) => {
    return route === pathname || route === '*';
  });
  const token = getCookie('token');
  if (resourceIsRequiredOnRoute) {
    if (shouldBeAuthorized) {
      if (!token) {
        return false;
      } else {
        try {
          return await callback(token);
        } catch (error) {
          toastGeneralError(error);
        }
      }
    }
    try {
      return await callback(token);
    } catch (error) {
      toastGeneralError(error);
    }
  } else {
    return false;
  }
  return false;
};
