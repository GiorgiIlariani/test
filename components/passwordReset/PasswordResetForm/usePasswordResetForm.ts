'use client';

import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { passwordResetRequest } from 'services';
import { PasswordResetFormType } from 'types';

export const usePasswordResetForm = (token: string, email: string) => {
  const router = useRouter();
  const form = useForm<PasswordResetFormType>({
    defaultValues: {
      password_confirmation: '',
      password: '',
      token,
      email,
    },
    mode: 'onSubmit',
    delayError: 600,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const submitHandler = async (data: PasswordResetFormType) => {
    if (data.password_confirmation.trim() !== data.password.trim()) {
      form.setError('password_confirmation', {
        type: 'required',
        message: 'Passwords do not match.',
      });
      return;
    }
    setIsLoading(true);
    const tenant = window.location.hostname.split('/').pop()?.split('.')[0];
    try {
      if (!tenant) throw new Error('Tenant is not defined');

      await passwordResetRequest(data, tenant);
      router.push('/login');
      setIsLoading(true);
    } catch (error: any) {
      setIsLoading(false);
      if (error?.response?.status == 403) {
        form.setError('password_confirmation', {
          type: 'required',
          message: error?.response.data.message ?? 'Your token is invalid.',
        });
        form.setFocus('password_confirmation', {
          shouldSelect: true,
        });
        return;
      }
      if (error?.response?.data.errors) {
        handleBackendErrors(error?.response?.data.errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error, router);
      }
    }
  };

  return {
    submitHandler,
    isLoading,
    form,
    showNewPassword,
    setShowNewPassword,
    showRepeatPassword,
    setShowRepeatPassword,
  };
};
