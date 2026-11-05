'use client';

import { toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { passwordRecoveryEmailRequest } from 'services';
import { SetState } from 'types';

export const useForgotPasswordForm = (setIsSent: SetState<boolean>) => {
  const router = useRouter();
  const form = useForm({ defaultValues: { email: '' } });
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await passwordRecoveryEmailRequest(data.email);
      setIsLoading(false);
      setIsSent(true);
    } catch (error: any) {
      setIsLoading(false);
      if (error?.response?.status === 422) {
        form.setError('email', { type: 'custom', message: 'Incorrect email' });
      } else {
        toastGeneralError(error, router);
      }
    }
  };
  return { form, submitHandler, isLoading };
};
