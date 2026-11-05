'use client';

import { getCookie } from 'cookies-next';
import Echo from 'laravel-echo';
import { useState, useEffect } from 'react';

export const useEcho = (tenant?: string) => {
  const [echo, setEcho] = useState<Echo<any> | null>(null);
  const [reminderEcho, setReminderEcho] = useState<Echo<any> | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && tenant) {
      const pusher = require('pusher-js');
      window.pusher = pusher;
      const echoInstance = new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        forceTLS: true,
        disableStats: true,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace(
          /api/,
          () => `${tenant}.api`,
        )}/api/tenant-broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`,
          },
        },
      });

      setEcho(echoInstance);

      const reminderEchoInstance = new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        forceTLS: true,
        disableStats: true,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace(
          /api/,
          () => `${tenant}.api`,
        )}/api/tenant-broadcasting/reminders`,
        auth: {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`,
          },
        },
      });

      setReminderEcho(reminderEchoInstance);

      return () => {
        echoInstance.disconnect();
        reminderEchoInstance.disconnect();
      };
    }
  }, [tenant]);
  return {
    echo,
    reminderEcho,
  };
};
