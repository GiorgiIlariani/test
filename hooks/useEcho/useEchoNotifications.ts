'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { useContext, useEffect } from 'react';
import { AuthUser, Notification } from 'types';
import { useEcho } from './useEcho';

export const useEchoNotifications = (tenant?: string) => {
  const { user, setNotifications, setNotificationSum } = useContext(GlobalApiInfo);
  const { echo } = useEcho(tenant);

  useEffect(() => {
    const userCookie = getCookie('end-user');
    const userFromCookie: AuthUser | null =
      typeof userCookie === 'string' ? JSON.parse(userCookie) : null;
    const userId = user?.id || userFromCookie?.id;
    if (!echo || !tenant || !userId) return;

    const channel = `notifications.${tenant}.${userId}`;
    echo.private(channel).listen('AddNotification', (event: { notification: Notification }) => {
      setNotifications((previous) => [event.notification, ...previous]);
      setNotificationSum((previous) => previous + 1);
    });

    return () => echo.leave(channel);
  }, [echo, setNotifications, setNotificationSum, tenant, user?.id]);
};
