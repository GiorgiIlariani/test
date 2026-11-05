import { Currency, SalaryPaymentType, ShowPageEmployee } from 'types';

export type Props = {
  oldSalary?: number | undefined;
  oldCurrency?: Currency;
  oldPaymentType?: SalaryPaymentType;
  disabled?: boolean;
  employee?: ShowPageEmployee;
  disableOtherReason?: boolean;
  salaryAttributes?: {
    increase: boolean;
    percentage: number;
  };
  defaultCurrency: Currency;
  grossToNetMultiplier: number | string;
};
