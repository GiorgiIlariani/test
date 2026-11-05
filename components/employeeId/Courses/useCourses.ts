'use client';

import { UseFieldArrayRemove, useFormContext, useWatch } from 'react-hook-form';
import { Courses, SetState } from 'types';

export const useCourses = (
  remove: UseFieldArrayRemove,
  setRemovedItems: SetState<number[]> | undefined,
  id: number | undefined,
  index: number,
) => {
  const { setValue, getValues } = useFormContext();

  const removeHandler = (removingIndex: number) => {
    const newState: Courses[] = [...getValues('courses')];
    newState.splice(removingIndex, 1);
    remove(removingIndex);
    id && setRemovedItems?.((prev) => prev.concat(+id!));
    setValue('courses', newState, {
      shouldDirty: true,
    });
  };

  const current = useWatch({ name: `courses.${index}.current` });
  const endDate = useWatch({ name: `courses.${index}.end_date` });
  const startDate = useWatch({ name: `courses.${index}.start_date` });

  return {
    removeHandler,
    getValues,
    current,
    endDate,
    setValue,
    startDate,
  };
};
