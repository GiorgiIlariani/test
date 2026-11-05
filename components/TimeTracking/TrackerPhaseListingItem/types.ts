import { Dispatch } from 'react';
import { UseFieldArrayRemove } from 'react-hook-form';
import { SetState, TimeLogEntry } from 'types';

export type Props = {
  i: number;
  fieldName: string;
  entries: TimeLogEntry;
  termIndex: number;
  projectIndex: number;
  updatePhaseTotalHours?: (projectIndex: number, termIndex: number) => void;
  timeLogId: number;
  selectedDate: string;
  remove: UseFieldArrayRemove;
  setIsSaving: SetState<boolean>;
  isDaySubmitted: boolean;
  getTimeLogEntriesHandler?: () => void;
  updateOnBlur?: boolean;
  setDefaultData?: Dispatch<any>;
};
