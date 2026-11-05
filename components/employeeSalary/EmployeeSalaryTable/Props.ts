import { Currency, Permission, SortingState } from 'types';
import { CellData, SalaryReport } from 'types/SalaryReport';

export type Props = {
  year: number;
  employees: SalaryReport;
  currency: Currency;
  loading: boolean;
  sortingState: SortingState;
  sortEmployeeSalary: (columnIndex: number) => void;
  permissions: Permission[];
  onCellClick: (cellData: CellData) => void;
};
