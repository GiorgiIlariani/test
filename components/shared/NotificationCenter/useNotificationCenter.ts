'use client';

import { GlobalApiInfo } from 'context';
import { useIsMobile } from 'hooks';
import { useContext, useState } from 'react';

export const useNotificationCenter = () => {
  const isMobile = useIsMobile(640);
  const { user, notificationSum, notifications, setNotifications } = useContext(GlobalApiInfo);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);

  return {
    isMobile,
    notificationIsOpen,
    setNotificationIsOpen,
    notificationSum,
    notifications,
    setNotifications,
    userRole: user.role,
  };
};
