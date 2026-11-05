import { EmployeeModel } from 'helpers';
import { VacationsArray, VacationStatus } from 'types';

export type Props = {
  month: string;
  index: number;
  currentYear: number;
  currentEmployee: EmployeeModel;
  employeeId: number;
  openAddingInSetTime: (data: { year: number; month: number }) => void;
  openModal: (arg0: VacationsArray[], arg1: number, arg2: VacationStatus) => void;
};
