'use client';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const useDiscountSection = () => {
  const { getValues, setValue } = useFormContext();
  const [discountDuration, discount, startDate] = useWatch({
    name: ['discount_duration', 'discount', 'start_date'],
  });

  const date = useMemo(() => new Date(startDate), [startDate]);

  return {
    discount,
    discountDuration,
    date,
    startDate,
    getValues,
    setValue,
  };
};
