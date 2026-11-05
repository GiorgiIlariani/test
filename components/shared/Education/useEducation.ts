'use client';
import { UseFieldArrayRemove, useFormContext, useWatch } from 'react-hook-form';
import { Education, SetState } from 'types';

export const useEducation = (
  remove: UseFieldArrayRemove,
  setRemovedItems: SetState<number[]> | undefined,
  id: number | undefined,
  index: number,
) => {
  const { setValue, getValues } = useFormContext();

  const removeHandler = (removingIndex: number) => {
    const newState: Education[] = [...getValues('education')];
    newState.splice(removingIndex, 1);
    remove(removingIndex);
    id && setRemovedItems?.((prev) => prev.concat(+id!));
  };

  const current = useWatch({ name: `education.${index}.current` });
  const endDate = useWatch({ name: `education.${index}.finish_date` });
  const startDate = useWatch({ name: `education.${index}.start_date` });

  return {
    removeHandler,
    getValues,
    current,
    endDate,
    startDate,
    setValue,
  };
};
