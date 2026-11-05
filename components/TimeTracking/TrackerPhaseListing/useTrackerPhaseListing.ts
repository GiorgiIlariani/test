import { useFormContext } from 'react-hook-form';
import { TimeLogEntries } from 'types';
import { sumOfDuration } from '../TimeTrackModule/helpers';
import { useState } from 'react';

export const useTrackerPhaseListing = () => {
  const { getValues, setValue } = useFormContext<{ projects: TimeLogEntries[] }>();
  const [isSubmitClicked, setIsSubmitClicked] = useState<number[] | boolean>(false);

  const updatePhaseTotalHours = (projectIndex: number, termIndex: number) => {
    const fieldName: any = `projects.${projectIndex}.terms.${termIndex}`;
    const termData = getValues(fieldName) as TimeLogEntries['terms'][number];
    const { hours, minutes } = sumOfDuration(termData.time_logs?.[0].entries);

    setValue(
      fieldName,
      {
        ...termData,
        total: { hours: hours, minutes: minutes },
      },
      { shouldValidate: true },
    );
  };

  const dayIncludesDraft = getValues('projects')?.some((el) =>
    el.terms?.some((term) => term.status === 'draft'),
  );

  return {
    getValues,
    updatePhaseTotalHours,
    isSubmitClicked,
    setIsSubmitClicked,
    dayIncludesDraft,
  };
};
