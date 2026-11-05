import { Currency, Permission } from 'types';
import { CellData, SalaryReportEmployee } from 'types/SalaryReport';

export type Props = {
  employee: SalaryReportEmployee;
  permissions: Permission[];
  currency: Currency;
  onCellClick: (cellData: CellData) => void;
  year: number;
};
