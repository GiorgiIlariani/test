'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { TimeOffConfig } from 'types';
import { updateTimeOffConfig } from 'services';
import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';

const hasTrialPeriod = (value: number | string | null) => Number(value) > 0;

const parseConfigNumber = (value: number | string | null) =>
  parseInt(value === 'N/A' || value === '' || value === null ? '0' : String(value), 10);

export const useTimeOffConfigsForm = (initialTimeOffConfig: TimeOffConfig) => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<TimeOffConfig>({
    defaultValues: initialTimeOffConfig,
    mode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const trialPeriod = useWatch({
    control,
    name: 'trial_period',
  });

  const isTrialPeriodEnabled = hasTrialPeriod(trialPeriod);

  const onSubmit = async (data: TimeOffConfig) => {
    setSubmitting(true);

    const payload = {
      ...data,
      trial_period: parseConfigNumber(data.trial_period),
      trial_bonus_days: hasTrialPeriod(data.trial_period)
        ? parseConfigNumber(data.trial_bonus_days)
        : 0,
    };

    try {
      await updateTimeOffConfig(getCookie('token'), payload);
      reset(payload);
    } catch (error: any) {
      const errors = error?.response?.data?.errors;

      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    reset,
    submitting,
    onSubmit,
    handleSubmit,
    trialPeriod,
    isTrialPeriodEnabled,
    isDirty,
  };
};
