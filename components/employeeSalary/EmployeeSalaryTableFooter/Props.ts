import { Currency } from 'types';
import { SalaryReport } from 'types/SalaryReport';

export type Props = {
  loading: boolean;
  employees: SalaryReport;
  year: number;
  currency: Currency;
};
