import { EmployeeModel } from 'helpers';

export type Props = {
  holidayDates: string[];
  currentEmployee: EmployeeModel;
  type?: string;
  reviewing: boolean;
};
