import { TimeOffConfig, VacationPeriod } from 'types';

export type Props = {
  currentUserVacationPeriods: VacationPeriod[] | undefined;
  isLoading: boolean;
  config: TimeOffConfig;
};
