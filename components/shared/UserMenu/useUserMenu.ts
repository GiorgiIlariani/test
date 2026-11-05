import { logOutHandler } from 'components/shared/Layout/helper';
import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { getOrganizationAuthorizeUrl } from 'services';

export const useUserMenu = () => {
  const router = useRouter();
  const { user, userOrganizations, notificationSum } = useContext(GlobalApiInfo);
  const isImpersonating = !!getCookie('impersonation_token');

  const switchOrganizationHandler = async (organization: string) => {
    const url = await getOrganizationAuthorizeUrl(getCookie('token'), organization);
    await logOutHandler();
    window.location.replace(url);
  };

  return {
    router,
    user,
    userOrganizations,
    notificationSum,
    isImpersonating,
    switchOrganizationHandler,
  };
};
