import { VacationsArray, VacationStatus } from 'types';

export type Props = {
  employeeVacationsData: VacationsArray[];
  employeeId: number;
  employeeName: string;
  isCurrentUser: boolean;
  month: string;
  monthKey: string;
  openModal: (arg0: VacationsArray[], arg1: number, arg2: VacationStatus) => void;
  openAddingInSetTime: () => void;
  onClose: () => void;
};
