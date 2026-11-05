'use client';

import { useFormContext, useWatch } from 'react-hook-form';

export const useTextarea = (inputName: string) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const inputValue = useWatch({
    name: inputName,
  });

  return {
    inputValue,
    register,
    errors,
  };
};
