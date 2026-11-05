import { EmployeeVacations } from 'types';

export type Props = {
  sumOfVacationsTable: {
    vacationDays: number;
    sickDays: number;
  };
  vacations: EmployeeVacations[];
  currentYear: number;
  isLoading: boolean;
};
