'use client';

import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CareerLogDetail } from 'types';

export const useTerminationShowModal = (logDetailedInfo: CareerLogDetail | undefined) => {
  const { setValue, getValues, register, formState, control } = useFormContext();
  const { errors } = formState;

  const [compensationEnabled, setCompensationEnabled] = useState(false);

  const [voluntarity, last_working_day] = useWatch({
    control: control,
    name: ['meta.voluntarity', 'date'],
  });
  const isTerminationNotVoluntary = voluntarity === 'involuntarily';

  const [compensationTill, setCompensationTill] = useState(false);

  const setCompensationTillDate = (lastWorkDay: string) => {
    const lastDay = new Date(lastWorkDay);
    const compensationTillDate = new Date(lastDay.setMonth(lastDay.getMonth() + 2));

    setValue('meta.compensation_till', compensationTillDate.toLocaleDateString('en-CA'));
  };

  useEffect(() => {
    setCompensationTill(!!logDetailedInfo?.data.meta?.compensation_till);
  }, [getValues]);

  return {
    setCompensationTillDate,
    register,
    errors,
    last_working_day,
    isTerminationNotVoluntary,
    compensationTill,
    setCompensationTill,
    compensationEnabled,
    setCompensationEnabled,
  };
};
