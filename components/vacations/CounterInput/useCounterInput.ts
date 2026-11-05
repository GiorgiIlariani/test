'use client';

import { useFormContext } from 'react-hook-form';

export const useCounterInput = (inputName: string) => {
  const { getValues, setValue, trigger } = useFormContext();

  const counterHandler = (operation: string) => {
    trigger();
    const existingInput = getValues(inputName);
    let changedInput = existingInput === '' ? 0 : Number(existingInput);

    if (operation === '-' && changedInput > 0) {
      setValue(inputName, changedInput - 1);
    }

    if (operation === '+') {
      setValue(inputName, changedInput + 1);
    }
  };

  const {
    register,
    formState: { errors },
  } = useFormContext();
  return { register, errors, counterHandler };
};
