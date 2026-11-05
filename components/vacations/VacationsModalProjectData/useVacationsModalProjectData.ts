'use client';

import { getWorkingDays } from 'helpers';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { VacationsReview, InternalProjects } from 'types';

export const useVacationsModalProjectData = (
  holidayDates: string[],
  getProjectExcludedStatus: (i: number) => string,
  vacationRequestDaysCount: number,
) => {
  const form = useFormContext<VacationsReview>();
  const { fields } = useFieldArray<{ internal_projects: InternalProjects[] }>({
    name: 'internal_projects',
  });

  const validateExcludedWorkDays = (value: string, i: number) => {
    if (value.toLowerCase() == 'no') {
      form.setValue(`internal_projects.${i}.excluded_work_days`, 0);
      form.clearErrors();
    } else if (value.toLowerCase() == 'fully') {
      form.setValue(
        `internal_projects.${i}.excluded_work_days`,
        getWorkingDays(
          new Date(form.getValues('start_date')),
          new Date(form.getValues('end_date')),
          holidayDates,
        ),
      );
      form.clearErrors();
    } else {
      form.setValue(`internal_projects.${i}.excluded_work_days`, 1);
    }
  };

  const maximumDaysValidation = (i: number) => {
    return getProjectExcludedStatus(i) === 'fully'
      ? vacationRequestDaysCount
      : vacationRequestDaysCount - 1;
  };

  return { fields, validateExcludedWorkDays, form, maximumDaysValidation };
};
