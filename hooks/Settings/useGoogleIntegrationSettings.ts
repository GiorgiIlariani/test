'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  deleteIntegrationsToken,
  getGoogleIntegrationSettings,
  googleGetUrl,
  updateGoogleSettings,
} from 'services';
import { GoogleIntergrationSettings } from 'types';
import { toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';

export const useGoogleIntegrationSettings = () => {
  const router = useRouter();
  const sessionKey = router.query.session_key as string | undefined;
  const form = useForm<GoogleIntergrationSettings>({
    defaultValues: {
      connected: router.query?.connected === 'true' || !!sessionKey,
      decline_meetings: true,
      decline_type: 'Only new meeting invitations',
      decline_message: 'Declined because I am out of office',
      time_offs_enabled: false,
      session_key: sessionKey ?? null,
    },
  });

  const { handleSubmit, watch, setValue, reset, register } = form;

  const [isLoading, setIsLoading] = useState(false);

  const connected = watch('connected');
  const declineMeetings = watch('decline_meetings');
  const timeOffsEnabled = watch('time_offs_enabled');

  const onSubmit = async (data: GoogleIntergrationSettings) => {
    setIsLoading(true);
    try {
      await updateGoogleSettings(getCookie('token'), data);
      router.push('/settings/integrations');
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGoogleRedirectUrl = async () => {
    setIsLoading(true);
    try {
      const url = await googleGetUrl(getCookie('token'));
      window.location.href = url.url;
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectHandler = async () => {
    try {
      setValue('connected', false);
      const { connected, ...rest } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: rest,
        },
        undefined,
        { shallow: true },
      );

      deleteIntegrationsToken(getCookie('token'), 'google');
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const getIntegrationSettings = async () => {
    try {
      const [response] = await Promise.all([getGoogleIntegrationSettings(getCookie('token'))]);

      if (response) {
        response.connected = true;
        reset(response);
      }
    } catch (error) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    getIntegrationSettings();
  }, []);

  return {
    form,
    isLoading,
    connected,
    declineMeetings,
    timeOffsEnabled,
    onSubmit,
    getGoogleRedirectUrl,
    disconnectHandler,
    handleSubmit,
    register,
    router,
  };
};
