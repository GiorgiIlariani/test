'use client';

import { useFormContext, useWatch, useFieldArray } from 'react-hook-form';
import { SetState } from 'types';

export const useInvoiceOtherExpenses = () => {
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'expenses',
  });

  const addNewExpense = () => {
    append({
      name: '',
      price: 0,
    });
  };

  const currency = useWatch({
    name: 'currency',
  });

  const removeExpense = (
    e: React.MouseEvent<Element, MouseEvent>,
    i: number,
    setHaveOtherExpenses: SetState<boolean> | undefined,
  ) => {
    e.preventDefault();
    if (fields.length === 1) {
      setValue('expenses', []);

      if (setHaveOtherExpenses) {
        setHaveOtherExpenses(false);
      }
    }
    remove(i);
  };

  return {
    addNewExpense,
    removeExpense,
    errors,
    fields,
    getValues,
    currency,
    setValue,
  };
};
