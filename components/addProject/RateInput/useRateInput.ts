'use client';

import { useFormContext, useWatch } from 'react-hook-form';

export const useRateInput = () => {
  const { register, setValue, getValues } = useFormContext();
  const currency = useWatch({
    name: 'currency',
  });

  return {
    register,
    currency,
    setValue,
    getValues,
  };
};
