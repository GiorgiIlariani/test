'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { checkIntegrationsStatus, deleteIntegrationsToken } from 'services';

export const useIntegrations = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    money_bird_connected: boolean;
    slack_connected: boolean;
    google_connected: boolean;
  }>({
    money_bird_connected: false,
    slack_connected: false,
    google_connected: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  const getInitialData = async () => {
    try {
      const [status] = await Promise.all([checkIntegrationsStatus(getCookie('token'))]);
      setConnectionStatus(status);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectHandler = (name: string) => {
    try {
      setConnectionStatus((prev) => {
        const keyMap: Record<string, keyof typeof prev> = {
          google: 'google_connected',
          slack: 'slack_connected',
          money_bird: 'money_bird_connected',
        };

        const key = keyMap[name];

        return {
          ...prev,
          [key]: false,
        };
      });
      deleteIntegrationsToken(getCookie('token'), name);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);
  return { connectionStatus, disconnectHandler, isLoading };
};
