'use client';

import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Staff } from 'types';

export const useEngagementWithSelect = () => {
  const { getValues, setValue, getFieldState, resetField, register } = useFormContext();
  const [selectPadding, setSelectPadding] = useState<'pr-6' | 'pr-4'>('pr-4');

  const selectChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const staffs = getValues('staffs');
    if (e.currentTarget.value === 'day') {
      staffs.map((staff: Staff, i: number) => {
        const engagementFieldState = getFieldState(`staffs.${i}.engagement`);
        const result =
          (engagementFieldState.isDirty
            ? staff?.engagement
            : staff?.original_engagement_without_formatting ?? 0) / 8;
        setValue(`staffs.${i}.engagement`, +result.toFixed(1));
        resetField(`staffs.${i}.engagement`, {
          defaultValue: +result.toFixed(1),
        });
        setValue(`staffs.${i}.original_engagement_without_formatting`, result, {
          shouldDirty: true,
        });
      });
      setSelectPadding('pr-6');
    } else {
      staffs.map((staff: Staff, i: number) => {
        const engagementFieldState = getFieldState(`staffs.${i}.engagement`);
        const result =
          (engagementFieldState!.isDirty!
            ? staff!.engagement
            : staff!.original_engagement_without_formatting ?? 0) * 8;
        setValue(`staffs.${i}.engagement`, result);
        resetField(`staffs.${i}.engagement`, {
          defaultValue: result,
        });
        setValue(`staffs.${i}.original_engagement_without_formatting`, result, {
          shouldDirty: true,
        });
      });
      setSelectPadding('pr-4');
    }
  };

  return {
    selectPadding,
    selectChangeHandler,
    register,
  };
};
