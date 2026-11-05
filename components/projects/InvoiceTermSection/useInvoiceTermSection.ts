'use client';

import { useFormContext, useWatch, useFieldArray } from 'react-hook-form';

export const useInvoiceTermSection = (fieldName: string) => {
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: fieldName,
  });

  const addField = () => {
    append({
      name: '',
      price: 0,
    });
  };

  const currency = useWatch({
    name: 'currency',
  });

  const removeField = (e: React.MouseEvent<Element, MouseEvent>, i: number) => {
    e.preventDefault();
    if (fields.length === 1) {
      setValue(fieldName, []);
    }
    remove(i);
  };

  return {
    addField,
    removeField,
    errors,
    fields,
    getValues,
    currency,
    setValue,
  };
};
