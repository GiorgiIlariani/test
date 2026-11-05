'use client';

import { GlobalApiInfo } from 'context';
import { useContext, useEffect } from 'react';
import { roundNumberToDecimals } from 'helpers';
import { useFormContext, useWatch } from 'react-hook-form';

export const useCarerChangeSalary = (grossToNetMultiplier: number | string, disabled?: boolean) => {
  const {
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext();
  const { currencyRates } = useContext(GlobalApiInfo);
  const [salary, currency, initiative, paymentType] = useWatch({
    name: ['salary', 'currency', 'meta.initiative', 'payment_type'],
  });

  useEffect(() => {
    const currentSalary = getValues('salary');

    if (disabled || currentSalary === '' || typeof currentSalary === 'undefined') {
      return;
    }

    setValue(
      'net_salary',
      roundNumberToDecimals(Number(currentSalary) * Number(grossToNetMultiplier), 2),
    );
  }, [disabled, getValues, grossToNetMultiplier, setValue]);

  function handleGrossSalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setValue('net_salary', '', { shouldDirty: true, shouldValidate: true });
      return;
    }

    const calculatedValue = roundNumberToDecimals(
      Number(e.target.value) * Number(grossToNetMultiplier),
      2,
    );

    setValue('net_salary', calculatedValue, { shouldDirty: true, shouldValidate: true });
  }

  function handleNetSalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setValue('salary', '', { shouldDirty: true, shouldValidate: true });
      return;
    }

    const multiplier = Number(grossToNetMultiplier);
    const calculatedValue =
      multiplier === 0 ? null : roundNumberToDecimals(Number(e.target.value) / multiplier, 2);

    setValue('salary', calculatedValue, { shouldDirty: true, shouldValidate: true });
  }

  return {
    salary,
    currency,
    initiative,
    errors,
    currencyRates,
    getValues,
    paymentType,
    handleGrossSalaryChange,
    handleNetSalaryChange,
  };
};
