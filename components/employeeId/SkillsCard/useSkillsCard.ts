'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { SetState, Skills } from 'types';
import { isSortable } from '@dnd-kit/react/sortable';

export const useSkillsCard = (
  setIsFormSubmitted: SetState<boolean>,
  setRemovedItems?: SetState<number[]> | undefined,
) => {
  const { getValues, control, reset, setValue } = useFormContext<{
    skills: Skills[];
    showAllSkills: boolean;
  }>();

  const { fields, append, remove, move } = useFieldArray({
    control: control,
    name: 'skills',
  });

  const onDragEnd = (event: any) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source.sortable;

      if (initialIndex !== index) {
        move(initialIndex, index);

        getValues('skills')?.forEach((_, i) => {
          setValue(`skills.${i}.skill_order`, i + 1);
        });
      }
    }
  };

  const appendNewSkill = () => {
    if (!getValues('skills')?.some((item) => !item.skill_id)) {
      append(
        {
          skill_id: '',
          title: '',
          skill_order: fields.length + 1,
          years_of_experience: '',
          months_of_experience: '',
          canNotEdit: false,
          competency_rate: '',
          is_preferred: false,
          isNew: true,
        } as Skills,
        { shouldFocus: false },
      );
      setValue('showAllSkills', false);
      setIsFormSubmitted(false);
    }
  };

  const removeSkill = (i: number, skill_id?: number | string) => {
    if (skill_id) {
      setRemovedItems?.((prev) => prev.concat(+skill_id));
      remove(i);
    } else {
      remove(i);
    }

    const isSomeUnchecked = getValues('skills').some((item) => !item.is_preferred);

    isSomeUnchecked ? setValue('showAllSkills', false) : setValue('showAllSkills', true);
  };
  return { appendNewSkill, removeSkill, fields, getValues, reset, onDragEnd, setValue };
};
