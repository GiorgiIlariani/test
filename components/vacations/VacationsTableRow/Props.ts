import { EmployeeVacations, TimeOffConfig, VacationsArray, VacationStatus } from 'types';

export type Props = {
  employee: EmployeeVacations;
  config: TimeOffConfig;
  currentYear: number;
  openAddingInSetTime: (data: { year: number; month: number }) => void;
  openModal: (arg0: VacationsArray[], arg1: number, arg2: VacationStatus) => void;
  monthNames: string[];
};
