import { VacationsArray } from 'types';

export type Props = {
  vacationData: VacationsArray[];
  currentVacationInfo: { sum: number; currentIndex: number };
  currentVacation: VacationsArray;
};
