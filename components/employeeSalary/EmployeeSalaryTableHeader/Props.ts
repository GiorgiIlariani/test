import { SortingState } from 'types';

export type Props = {
  sortingState: SortingState;
  sortEmployeeSalary: (columnIndex: number) => void;
};
