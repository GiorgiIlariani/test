'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Achievements, SetState } from 'types';

export const useAchievementsCard = (setIds?: SetState<number[]> | undefined) => {
  const { getValues, control } = useFormContext<{ achievements: Achievements[] }>();

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'achievements',
  });

  const removeAchievements = async (index: number) => {
    remove(index);
    const id = fields[index].itemId;
    id && setIds?.((prev) => [...prev, +id]);
  };

  const addAchievements = () => {
    append({
      name: '',
      organization: '',
      description: '',
      attach_link: '',
      certification: null,
      year: '',
      id: null,
      itemId: null,
      order: fields.length + 1,
      delete_existing_file: 0,
    });
  };
  return { removeAchievements, addAchievements, fields, getValues };
};
