import { Holiday, SetState } from 'types';

export type Props = {
  currentYear: number;
  setHolidays: SetState<Holiday[]>;
  holidays: Holiday[];
  isLoading: boolean;
};
