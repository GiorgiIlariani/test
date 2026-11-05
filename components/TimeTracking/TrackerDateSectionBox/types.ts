import { SetState, TimeLogEntryStatus, WeeklyReport } from 'types';

export type Props = {
  date: {
    date: string;
    hours: number;
    minutes: number;
    status: TimeLogEntryStatus;
  };
  selectedDate: string;
  setSelectedDate: SetState<string>;
  isLoading: boolean;
  projects: WeeklyReport['string']['projects'];
};
