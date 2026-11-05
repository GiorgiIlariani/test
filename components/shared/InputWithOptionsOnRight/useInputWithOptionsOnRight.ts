'use client';

import { useFormContext, useWatch } from 'react-hook-form';

export const useInputWithOptionsOnRight = (inputName: string, selectName: string) => {
  const {
    getValues,
    register,
    formState: { errors },
  } = useFormContext();

  const [input, select] = useWatch({
    name: [inputName, selectName],
  });

  return {
    getValues,
    register,
    errors,
    select,
    input,
  };
};
