import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getMoneyBirdCredentials, postMoneyBirdCredentials } from 'services';
import { SetState } from 'types';

export const useCredentialsSection = (setCredentialsUpdated: SetState<boolean>) => {
  let data;
  const form = useForm<{ token: string; administration_id: string }>(data);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (data: { token: string; administration_id: string }) => {
    try {
      await postMoneyBirdCredentials(getCookie('token'), data);
      setCredentialsUpdated((prev) => !prev);
      setIsSubmitted(true);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const getCredentialsHandler = async () => {
    try {
      const response = await getMoneyBirdCredentials(getCookie('token'));
      form.reset({
        administration_id: response.authentication_data?.administration_id,
        token: response.authentication_data?.token,
      });
      data = {
        administration_id: response.authentication_data?.administration_id,
        token: response.authentication_data?.token,
      };
      setLoading(false);
    } catch (_error) {}
  };

  useEffect(() => {
    getCredentialsHandler();
  }, []);

  const cancelHandler = () => {
    form.reset();
  };

  const isButtonDisabled = !form.formState.isDirty || isSubmitted;

  return { form, handleSubmit, cancelHandler, loading, isButtonDisabled, setIsSubmitted };
};
