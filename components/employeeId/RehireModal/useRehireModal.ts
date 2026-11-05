'use client';

import { getCookie } from 'cookies-next';
import { analytics, handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { postCareerHistory } from 'services';
import { ActionForm, EmployeeFormFieldDefaults, SetState } from 'types';

export const useRehireModal = (
  toggleModal: () => void,
  userId: number,
  setActionsAreAdded: SetState<boolean>,
  refetchEmployees?: () => void | undefined,
  defaultDate?: string,
  isInBudgetView?: boolean,
) => {
  const { setValue } = useFormContext<EmployeeFormFieldDefaults>();
  const form = useForm<ActionForm>({
    defaultValues: {
      date: defaultDate ?? '',
      status: isInBudgetView ? 'draft' : 'active',
      type: ['Re-employed'],
      user_id: userId,
    },
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (data: Partial<ActionForm>) => {
    setLoading(true);
    try {
      const dataCopy = { ...data };

      await postCareerHistory(getCookie('token'), dataCopy);

      if (dataCopy.date && new Date(dataCopy.date) <= new Date()) {
        setValue('leave_date', '');
      }

      setActionsAreAdded((prev) => !prev);
      analytics.track('Employee Rehired');
      toggleModal();
      refetchEmployees?.();
    } catch (error: any) {
      if (error?.response?.status === 422) {
        handleBackendErrors(error?.response?.data.errors, form.setFocus, form.setError);
        error.response.data.message === "Career history can't be created" &&
          toastGeneralError(
            error,
            null,
            'Delete previous one and add another termination again',
            'Termination already exists',
            'general_error',
            true,
          );
      } else {
        toastGeneralError(error, router);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    handleSubmit,
    loading,
  };
};
