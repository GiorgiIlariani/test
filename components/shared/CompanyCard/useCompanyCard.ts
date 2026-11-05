'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Experiences } from 'types';

export const useCompanyCard = () => {
  const { control, setValue, getValues } = useFormContext<{
    experiences: Experiences[];
    showAllExperienceYears: boolean;
  }>();

  const { append, remove, fields } = useFieldArray({
    control: control,
    name: 'experiences',
  });

  const addCompanyCountHandler = () => {
    append(
      {
        company: '',
        description: '',
        end_date: '',
        start_date: '',
        current: false,
        id: null,
        experience_id: '',
        position: '',
        location: '',
        employment_type_id: '',
        industry_id: '',
        order: fields.length + 1,
        is_preferred: !!getValues(`showAllExperienceYears`),
      },
      { focusName: `experiences.${fields.length}.company` },
    );
  };

  return {
    addCompanyCountHandler,
    remove,
    fields,
    setValue,
  };
};
