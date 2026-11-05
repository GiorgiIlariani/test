'use client';

import { getCookie } from 'cookies-next';
import { formatFilterOptionsForBackend, handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { saveFilterRequest } from 'services';
import { FormValues, Props } from './types';

export const useSaveFilterModal = (
  filterOptions: Props['filterOptions'],
  setFilterIsSaved: Props['setFilterIsSaved'],
  closeHandler: Props['closeHandler'],
  setSavedFiltersState: Props['setSavedFiltersState'],
) => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      is_private: 'no',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { errors } = form.formState;

  const submitHandler = async (data: { name: string; is_private: 'no' | 'yes' }) => {
    try {
      setIsLoading(true);
      const filters = formatFilterOptionsForBackend(filterOptions, true);
      const res = await saveFilterRequest(getCookie('token'), {
        filters,
        is_private: data.is_private === 'yes',
        name: data.name,
        page: router.pathname,
      });
      setSavedFiltersState?.((prev) => {
        const newState = [...prev, res.message];
        return newState;
      });
      setFilterIsSaved(true);
      closeHandler();
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { form, errors, isLoading, submitHandler };
};
