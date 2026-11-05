import { Currency, Department, IncomeStatement, SetState } from 'types';

export type Props = {
  isOtherAdmin?: boolean;
  setIncome: SetState<IncomeStatement[]>;
  setOriginalIncome: SetState<IncomeStatement[]>;
  currency: Currency;
  originalCurrency: Currency;
  income: IncomeStatement[];
  year: number;
  departments: Department[];
};
