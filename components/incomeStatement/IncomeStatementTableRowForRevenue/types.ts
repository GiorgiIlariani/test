import { Currency, IncomeStatement, SortingState } from 'types';

export type Props = {
  currency: Currency;
  income: IncomeStatement[];
  title: string;
  row: 'revenue' | 'adjusted_revenue';
  detailHeaderZIndex: number;
  percentageValues?: boolean;
  negativeValues?: boolean;
  sortingState?: SortingState | undefined;
};
