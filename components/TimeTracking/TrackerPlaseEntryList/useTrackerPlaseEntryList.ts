import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const useTrackerPlaseEntryList = (projectIndex: number, termIndex: number, term: any) => {
  const { control, getValues } = useFormContext();
  const { append, fields, remove } = useFieldArray({
    name: `projects.${projectIndex}.terms.${termIndex}.time_logs.0.entries`,
    control,
  });

  const [isInEditMode, setIsInEditMode] = useState(false);

  let termIsDisabled = term.status === 'submitted' || term.status === 'approved';

  const addNewEntry = () => {
    append({
      start_time: '',
      end_time: '',
      hour: '',
      minutes: '',
      notes: '',
    });
  };

  return { fields, addNewEntry, remove, getValues, termIsDisabled, setIsInEditMode, isInEditMode };
};
