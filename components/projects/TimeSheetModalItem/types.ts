import { SetState } from 'types';

export type Props = {
  data: { actual_hours: number };
  inputName: string;
  disabled: boolean;
  i: number;
  termInputName: string;
  weekDay: string;
  setIsFormDirty: SetState<boolean>;
  date: string | Date;
  termId: number;
  employeeId: number;
  getModalData: () => void;
};
