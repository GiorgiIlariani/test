'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Education } from 'types';

export const useEducationCard = () => {
  const {
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<{ education: Education[]; showAllEducationYears: boolean }>();

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'education',
  });

  const addEducation = () => {
    append(
      {
        degree: '',
        faculty: '',
        finish_date: '',
        id: undefined,
        education_id: '',
        start_date: '',
        university: '',
        description: '',
        order: fields.length + 1,
        is_preferred: !!getValues('showAllEducationYears'),
      },
      { focusName: `education.${fields.length}.university` },
    );
  };

  return {
    addEducation,
    getValues,
    errors,
    remove,
    fields,
    setValue,
  };
};
