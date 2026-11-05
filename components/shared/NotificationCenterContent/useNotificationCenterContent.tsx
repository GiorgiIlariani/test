'use client';

import { getCookie } from 'cookies-next';
import { markAllNotificationAsSeen, markNotificationAsSeen } from 'services';
import { Notification, SetState } from 'types';
import { useRouter } from 'next/router';
import { toastGeneralError } from 'helpers';
import { useContext, useEffect, useState } from 'react';
import { GlobalApiInfo } from 'context';
import { Props } from './types';
import { getNotificationType } from 'helpers';

export const useNotificationCenterContent = (
  setNotifications: SetState<Notification[]>,
  notifications: Props['notifications'],
  onClose: Props['onClose'],
) => {
  const router = useRouter();
  const { setNotificationSum } = useContext(GlobalApiInfo);

  const [notificationFilter, setNotificationFilter] = useState<'unread' | 'read' | 'all'>('unread');
  const [filteredNotifications, setFilteredNotifications] = useState<Props['notifications']>(
    notifications.filter((notification) => !notification.seen),
  );

  useEffect(() => {
    switch (notificationFilter) {
      case 'read':
        return setFilteredNotifications(notifications.filter((notification) => notification.seen));
      case 'all':
        return setFilteredNotifications(notifications);
      default:
        return setFilteredNotifications(notifications.filter((notification) => !notification.seen));
    }
  }, [notifications, notificationFilter]);

  const filterChangeHandler = (newFilter: 'unread' | 'read' | 'all') => {
    setNotificationFilter(newFilter);
  };

  const markNotificationAsSeenHandler = async (notification: Notification) => {
    try {
      setNotificationSum((prevState) =>
        prevState && !notification.seen ? prevState - 1 : prevState + 1,
      );

      setNotifications((prevState) => {
        return prevState.map((item) => {
          if (item.id === notification.id) {
            return { ...item, seen: notification.seen ? 0 : 1 };
          }
          return item;
        });
      });

      await markNotificationAsSeen(notification.id, getCookie('token'));
    } catch (_error: any) {
      toastGeneralError(
        'This comment is already deleted',
        null,
        'Comment is deleted',
        'notification-error',
        'notification-error',
      );
    }
  };

  const redirectToNotificationHandler = async (notification: Notification) => {
    if (!notification.seen) {
      setNotificationSum((prevState) => Math.max(0, prevState - 1));

      setNotifications((prevState) => {
        return prevState.map((item) => {
          if (item.id === notification.id) {
            return { ...item, seen: 1 };
          }
          return item;
        });
      });
    }

    const { meta, type } = getNotificationType(notification);
    const url = new URL(window.location.origin);

    if (type === 'vacation') {
      url.pathname = 'time-offs';
      url.searchParams.append('vacation_id', notification.data?.vacation_id?.toString() ?? '');
      if (meta.review) {
        url.searchParams.append('reviewing', '1');
      }
    }

    if (type === 'invoice') {
      notification.data?.project_id
        ? (url.pathname = `/projects/${notification.data?.project_id}/invoices`)
        : (url.pathname = 'invoices');

      url.searchParams.append('invoice_id', notification.data?.invoice_id?.toString() ?? '');
      if (meta.review) {
        url.searchParams.append('reviewing', '1');
      }
    }

    if (type === 'project') {
      url.pathname = `/projects/${notification.data?.project_id ?? ''}/${
        notification.data?.project_id ? 'terms' : ''
      }`;

      if (notification.notification_type.includes('term')) {
        if (notification.data?.term_id) {
          url.searchParams.append('termId', notification.data?.term_id.toString() ?? '');
        } else if (notification.data?.terms?.length === 1) {
          url.searchParams.append('termId', notification.data?.terms?.[0]?.id?.toString() ?? '');
        } else {
          router.push(`/projects/${notification.data?.project_id}/plan`);
        }
        url.searchParams.append('showMode', '1');
      }
    }

    if (type === 'time logs') {
      url.pathname = `/projects/${notification.data?.project_id ?? ''}/timesheets`;
    }

    if (type === 'career logs') {
      url.pathname = `/employee/${notification.from_user?.id}/career-history`;
    }

    if (!meta.deleted) {
      router.push(url, url);
    }

    onClose();

    if (!notification.seen) {
      await markNotificationAsSeen(notification.id, getCookie('token'));
    }
  };

  const markAllAsSeenHandler = async () => {
    try {
      setNotifications((prevState) => {
        return prevState.map((notification) => {
          return { ...notification, seen: 1 };
        });
      });
      setNotificationSum(0);
      await markAllNotificationAsSeen(getCookie('token'));
    } catch (error: any) {
      toastGeneralError(error);
    }
  };
  return {
    markNotificationAsSeenHandler,
    markAllAsSeenHandler,
    notificationFilter,
    filterChangeHandler,
    filteredNotifications,
    redirectToNotificationHandler,
  };
};
