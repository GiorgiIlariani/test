import { INCOME_HEADERS } from 'config';
import { Currency, Department, IncomeStatement, SetState } from 'types';

export type Props = {
  currency: Currency;
  originalCurrency: Currency;
  income: IncomeStatement[];
  setIncome: SetState<IncomeStatement[]>;
  setOriginalIncome: SetState<IncomeStatement[]>;
  year: number;
  departments: Department[];
  loading: boolean;
  sortIncomeStatement: (index: number) => void;
  sortingState: {
    name: (typeof INCOME_HEADERS)[number];
    sortedBy: 'asc' | 'desc' | '';
  }[];
};
