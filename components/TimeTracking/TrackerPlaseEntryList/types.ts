import { SetState } from 'types';

export type Props = {
  selectedDate: string;
  projectIndex: number;
  termIndex: number;
  updatePhaseTotalHours: (projectIndex: number, termIndex: number) => void;
  timeLogId: number;
  setIsSaving: SetState<boolean>;
  term: any;
  isSaving: boolean;
  project: any;
  setIsSubmitClicked: SetState<boolean | number[]>;
  timeLogIds: number[];
  getTimeLogEntriesHandler: () => void;
};
