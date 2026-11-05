'use client';

import { setCookie } from 'cookies-next';
import { domainAndSubdomains } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginRequest } from 'services';
import { LoginFormType } from 'types';

export const useLoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginFormType>({
    defaultValues: {
      email: '',
      password: '',
      'remember-me': true,
    },
    mode: 'onSubmit',
    delayError: 600,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (data: LoginFormType) => {
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
    try {
      setIsLoading(true);
      setCookie('remember_me', data['remember-me'], { domain: domainAndSubdomains });
      await loginRequest(data);
      router.replace(`${baseUrl}/verify-notice`);
    } catch (error: any) {
      setIsLoading(false);
      form.setFocus('password');
      if (error?.response?.status !== 500) {
        form.setError('password', {
          type: 'manual',
          message: 'Invalid email or password.',
        });
      }
    }
  };
  return {
    submitHandler,
    isLoading,
    form,
    showPassword,
    setShowPassword,
  };
};
