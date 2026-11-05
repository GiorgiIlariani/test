'use client';

import { logOutHandler } from 'components/shared/Layout/helper';
import { GlobalApiInfo } from 'context';
import { getCookie, setCookie } from 'cookies-next';
import { analytics, can, toastGeneralError } from 'helpers';
import { useContext, useState } from 'react';
import { getImpersonateAuthorizeUrl } from 'services';
import { Permission } from 'types';

export const usePrivilegedUsersTableRow = (permissions: Permission[]) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImpersonateLoading, setIsImpersonateLoading] = useState(false);

  const modalToggler = () => {
    !isModalOpen && analytics.track('User Management - Edit User');
    setIsModalOpen((prevState) => !prevState);
  };

  const { user: authUser } = useContext(GlobalApiInfo);

  const handleImpersonate = async (id: number) => {
    setIsImpersonateLoading(true);
    try {
      const { url, adminToken } = await getImpersonateAuthorizeUrl(getCookie('token'), id);
      await logOutHandler();
      setCookie('impersonation_token', adminToken);
      window.location.replace(url);
    } catch (e) {
      toastGeneralError(e);
    } finally {
      setIsImpersonateLoading(false);
    }
  };

  const canUserUpdateOrDelete =
    can('user::update', permissions) || can('user::delete', permissions);

  const canImpersonate = can('user::impersonate', permissions);

  return {
    isModalOpen,
    modalToggler,
    handleImpersonate,
    isImpersonateLoading,
    authUser,
    canUserUpdateOrDelete,
    canImpersonate,
  };
};
