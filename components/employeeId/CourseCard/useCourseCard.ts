'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Courses } from 'types';

export const useCourseCard = () => {
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<{ courses: Courses[] }>();

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'courses',
  });

  const addCourse = () => {
    append(
      {
        school: '',
        course_name: '',
        current: false,
        start_date: '',
        end_date: '',
        certification: null,
        attach_link: '',
        id: null,
        course_id: null,
        order: fields.length + 1,
        delete_existing_file: 0,
      },
      { focusName: `courses.${fields.length}.school` },
    );
  };

  return {
    addCourse,
    getValues,
    errors,
    remove,
    fields,
  };
};
