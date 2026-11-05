import { SetState } from 'types';

export type Props = {
  selectedDate: string;
  setIsSaving: SetState<boolean>;
  submitDay: (id?: number[]) => void;
  isDaySubmitted: boolean;
  isSaving: boolean;
  getTimeLogEntriesHandler: () => void;
};
