'use client';

import { ChangeEvent, useContext, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Props } from './types';
import { GlobalApiInfo } from 'context';
import ReactDatePicker from 'react-datepicker';

export const useNormalInput = (
  inputName: string,
  registerOptions: Props['registerOptions'],
  externalOnChange: Props['externalOnChange'],
  type: Props['type'],
  doNotExcludeHolidays?: boolean,
) => {
  const {
    formState: { errors },
    getValues,
    register,
    setValue,
  } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);
  const inputValue: string = useWatch({
    name: inputName,
  });

  const { ref, ...registerValues } = register(inputName, {
    ...registerOptions,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      externalOnChange?.(e);

      if (type !== 'date') return;
    },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const holidays = useContext(GlobalApiInfo).publicHolidays.holidays;
  const holidayDates = useMemo(
    () => (doNotExcludeHolidays ? [] : holidays.map((h) => new Date(h.date))),
    [holidays, doNotExcludeHolidays],
  );
  const datePickerRef = useRef<ReactDatePicker | null>(null);

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return {
    registerValues,
    holidayDates,
    setIsVisible,
    inputValue,
    getValues,
    isVisible,
    setValue,
    inputRef,
    errors,
    ref,
    openDatePicker,
    datePickerRef,
  };
};
