'use client';

import { GlobalApiInfo } from 'context';
import { useContext, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Skills } from 'types';

export const useSkillModalItem = (i: number) => {
  const { getValues, watch, trigger, setValue, formState, control } = useFormContext();
  const { skills } = useContext(GlobalApiInfo);

  const skillId = useWatch({ name: `skills.${i}.skill_id`, control });

  const isRowValid =
    (getValues(`skills.${i}.years_of_experience`) ||
      getValues(`skills.${i}.months_of_experience`) ||
      getValues(`skills.${i}.is_preferred`) ||
      getValues(`skills.${i}.competency_rate`)) &&
    !skillId;

  const showAll = useWatch({ name: 'showAllSkills', control });

  const selectedSkillsIds = getValues('skills')
    ?.filter((item: Skills) => item.skill_id && item.title)
    ?.map((item: any) => +item.skill_id);

  const filteredSkills = useMemo(() => {
    return skills.filter((item) => !selectedSkillsIds.includes(item.id) || item.id === +skillId);
  }, [selectedSkillsIds, skills, skillId]);

  const showYearsHandler = (isNotChecked: boolean) => {
    if (!isNotChecked) {
      setValue('showAllSkills', false);
    } else {
      getValues('skills')?.every((item: Skills) => item.is_preferred) &&
        setValue('showAllSkills', true);
    }
  };

  return {
    showAll,
    getValues,
    watch,
    trigger,
    filteredSkills,
    isRowValid,
    setValue,
    formState,
    showYearsHandler,
  };
};
