import { SetState, TimeLogEntryStatus, WeeklyReport } from 'types';

export type Props = {
  selectedDate: string;
  setSelectedDate: SetState<string>;
  isLoading: boolean;
  isSaving: boolean;
  dateArray: {
    date: string;
    hours: number;
    minutes: number;
    status: TimeLogEntryStatus;
    projects: WeeklyReport['string']['projects'];
  }[];
  setDateArray: SetState<
    {
      date: string;
      hours: number;
      minutes: number;
      status: TimeLogEntryStatus;
      projects: WeeklyReport['string']['projects'];
    }[]
  >;
  isDaySubmitted: boolean;
};
