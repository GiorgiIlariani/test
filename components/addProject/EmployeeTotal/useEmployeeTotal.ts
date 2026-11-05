'use client';

import { calculateMonthTotalWithoutDiscount, georgianHolidays, getWorkingDays } from 'helpers';
import { useContext, useMemo } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { Props } from './types';
import { GlobalApiInfo } from 'context';

export const useEmployeeTotal = (inputNameStart: Props['inputNameStart']) => {
  const { setValue } = useFormContext();
  const holidays = useContext(GlobalApiInfo).publicHolidays.holidays.map((h) => h.date);

  const [rate, engagement, currency, startDate, endDate, engagementMeasurementUnit] = useWatch({
    name: [
      `${inputNameStart}.rate`,
      `${inputNameStart}.engagement`,
      'currency',
      'start_date',
      'end_date',
      'engagement_measurement_unit',
    ],
  });
  const formState = useFormState();
  const updatedTotal = useMemo(() => {
    const startDateDateObject = new Date(new Date(startDate).toLocaleDateString('en-CA'));
    const endDateDateObject = new Date(new Date(endDate).toLocaleDateString('en-CA'));
    const calculatedTotal = engagementMeasurementUnit
      ? calculateMonthTotalWithoutDiscount(
          rate,
          engagement,
          startDateDateObject,
          holidays,
          setValue,
          endDateDateObject,
          engagementMeasurementUnit,
        )
      : Number(rate) *
        (engagement / 100) *
        getWorkingDays(
          new Date(startDate),
          new Date(endDate),
          georgianHolidays(new Date(endDate)?.getFullYear()),
        ) *
        8;
    setValue(`${inputNameStart}.total`, calculatedTotal);

    return calculatedTotal;
  }, [
    startDate,
    endDate,
    engagementMeasurementUnit,
    rate,
    engagement,
    holidays,
    setValue,
    inputNameStart,
  ]);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat('eu', {
      currency: currency ?? 'EUR',
      style: 'currency',
      maximumFractionDigits: 2,
      currencyDisplay: 'narrowSymbol',
    });
  }, [currency]);

  return {
    currency,
    updatedTotal,
    rate,
    engagement,
    startDate,
    formatter,
    formState,
  };
};
