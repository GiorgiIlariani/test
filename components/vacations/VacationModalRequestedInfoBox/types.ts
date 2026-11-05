import { EmployeeModel } from 'helpers';
import { UseFormReturn } from 'react-hook-form';
import { Department, VacationsArray, VacationsReview, VacationStatus } from 'types';

export type Props = {
  employeeMinimalData:
    | {
        id: number;
        first_name: string;
        last_name: string;
        avatar: string;
        department: Department;
      }
    | undefined;
  modalType: VacationStatus;
  currentVacation: VacationsArray;
  userId: number;
  canNotEdit: boolean;
  form: UseFormReturn<VacationsReview, any, undefined>;
  holidayDates: string[];
  type: string;
  currentEmployee: EmployeeModel;
  reviewing: boolean;
};
