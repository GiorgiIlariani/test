import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateGrossAndNetSalaryConfig } from 'services';
import { GrossAndNetSalaryConfigFormValues } from './types';

export const useGrossAndNetSalaryConfigForm = (grossToNetMultiplier: number | string) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<GrossAndNetSalaryConfigFormValues>({
    defaultValues: {
      // The backend sends this as text with 3 decimals, like "1.000".
      // Convert it so the input shows a cleaner value, like "1".
      gross_to_net_multiplier: Number(grossToNetMultiplier).toString(),
    },
    mode: 'onSubmit',
  });
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const onSubmit = async ({ gross_to_net_multiplier }: GrossAndNetSalaryConfigFormValues) => {
    setSubmitting(true);

    try {
      await updateGrossAndNetSalaryConfig(getCookie('token'), Number(gross_to_net_multiplier));
      reset({
        gross_to_net_multiplier,
      });
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

  return { form, isDirty, handleSubmit, onSubmit, reset, submitting };
};
