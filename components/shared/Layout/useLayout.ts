'use client';

import { GlobalApiInfo } from 'context';
import { addHours, analytics, getUserTokenInfo } from 'helpers';
import { getCookie, setCookie } from 'cookies-next';
import { useRouteChangeLoader } from 'hooks';
import { useEchoNotifications } from 'hooks/useEcho';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { AuthUser, Currency } from 'types';
import { getOriginalUserAuthorizeUrl } from 'services';
import { logOutHandler } from './helper';

export const useLayout = (
  setCurrency?: Dispatch<SetStateAction<Currency>>,
  externalCurrencyChangeHandler?: (currency: Currency) => void,
) => {
  const isImpersonating = !!getCookie('impersonation_token');
  const { isLoading } = useRouteChangeLoader();
  const { user, applicationConfigs } = useContext(GlobalApiInfo);
  const currencyConfig = applicationConfigs.currency;
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencyConfig.currency);

  const tenant = getUserTokenInfo()?.tenant;
  useEchoNotifications(tenant);

  useEffect(() => {
    const userCookie = getCookie('end-user');
    if (typeof userCookie !== 'string') return;

    const userFromCookie: AuthUser = JSON.parse(userCookie);
    const segmentStatus = getCookie('segment-status');

    if (segmentStatus === 'should-identify' || !segmentStatus) {
      analytics.identify(userFromCookie.id.toString(), {
        id: userFromCookie.id,
        firstName: userFromCookie.first_name,
        lastName: userFromCookie.last_name,
        email: userFromCookie.email,
        role: userFromCookie.role,
      });

      setCookie(
        'segment-status',
        'identified',
        segmentStatus ? undefined : { expires: addHours(new Date(), 365 * 24) },
      );
    }
  }, []);

  useEffect(() => {
    const userCookie = getCookie('end-user');
    const userFromCookie: AuthUser | null =
      typeof userCookie === 'string' ? JSON.parse(userCookie) : null;
    const latestCurrency =
      (getCookie(`${tenant}-${(userFromCookie ?? user).id}-currency`) as Currency) ??
      currencyConfig.currency;

    setSelectedCurrency(latestCurrency);
    setCurrency?.(latestCurrency);
  }, [currencyConfig, setCurrency, tenant, user]);

  const currencyChangeHandler = (currency: Currency) => {
    externalCurrencyChangeHandler?.(currency);
    setCookie(`${tenant}-${user.id}-currency`, currency);
    setSelectedCurrency(currency);
    setCurrency?.(currency);
  };

  const handleCancelImpersonate = async () => {
    const adminToken = getCookie('impersonation_token') as string;
    const url = await getOriginalUserAuthorizeUrl(getCookie('token'), adminToken);
    await logOutHandler();
    window.location.replace(url);
  };

  return {
    isImpersonating,
    user,
    handleCancelImpersonate,
    currencyConfig,
    selectedCurrency,
    currencyChangeHandler,
    currencyIsLoading: !currencyConfig.currency || !selectedCurrency,
    hideCurrencyInput: !setCurrency || user.role === 'employee',
    isLoading,
  };
};
