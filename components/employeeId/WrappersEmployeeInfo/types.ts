import { Employee } from 'types';

export type Props = {
  updateDate: string;
  position: string;
  employee: Employee;
  refetch?: () => void;
};
