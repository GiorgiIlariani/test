'use client';

import { useFormContext, useWatch } from 'react-hook-form';

export const useInputWithRightText = (inputName: string) => {
  const {
    formState: { errors },
    getValues,
    register,
  } = useFormContext();
  useWatch({
    name: inputName,
  });

  return {
    errors,
    getValues,
    register,
  };
};
