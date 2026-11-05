'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Project } from 'types';

export const useProjectCard = () => {
  const { control, setValue, getValues } = useFormContext<{
    projects: Project[];
    showAllProjectYears: boolean;
  }>();

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'projects',
  });

  const addProjectHandler = () => {
    append(
      {
        company: '',
        description: '',
        end_date: '',
        id: null,
        project_id: null,
        industry: null,
        responsibility: '',
        role: '',
        start_date: '',
        skills: [],
        title: '',
        media_link: '',
        media: null,
        file: null,
        is_currently_working: false,
        order: fields.length + 1,
        is_preferred: !!getValues('showAllProjectYears'),
      },
      { focusName: `projects.${fields.length}.title` },
    );
  };

  return {
    addProjectHandler,
    remove,
    fields,
    setValue,
  };
};
