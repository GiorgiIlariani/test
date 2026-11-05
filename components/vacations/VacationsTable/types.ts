import { EmployeeVacations, TimeOffConfig, VacationStatus, VacationsArray } from 'types';

export type Props = {
  vacations: EmployeeVacations[];
  isLoading: boolean;
  openModal: (arg0: VacationsArray[], arg1: number, arg2: VacationStatus) => void;
  currentYear: number;
  sumOfVacationsTable: {
    vacationDays: number;
    sickDays: number;
  };
  openAddingInSetTime: (data: { year: number; month: number }) => void;
  config: TimeOffConfig;
  loadMoreVacations: () => void;
  hasMoreVacations: boolean;
};
