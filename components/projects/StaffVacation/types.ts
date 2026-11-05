import { StaffMinimalEmployee, StaffingAndTermVacation } from 'types';

export type Props = {
  vacation: StaffingAndTermVacation;
  loading: boolean | undefined;
  employees: StaffMinimalEmployee[];
};
