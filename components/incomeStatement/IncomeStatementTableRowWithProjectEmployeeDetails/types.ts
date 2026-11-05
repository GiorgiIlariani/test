import { Currency, IncomeStatement, SortingState } from 'types';

export type Props = {
  currency: Currency;
  income: IncomeStatement[];
  title: string;
  row:
    | 'excluded_time_offs'
    | 'cogs_of_projects'
    | 'gross_profit_of_projects'
    | 'gross_margin_of_projects'
    | 'internal_project_costs';
  detailHeaderZIndex: number;
  percentageValues?: boolean;
  negativeValues?: boolean;
  sortingState?: SortingState | undefined;
  titleClasses?: string;
};
