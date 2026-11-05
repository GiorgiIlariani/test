import { Currency, IncomeStatement, SortingState } from 'types';

export type Props = {
  currency: Currency;
  income: IncomeStatement[];
  title: string;
  row?:
    | 'revenue'
    | 'adjusted_revenue'
    | 'excluded_time_offs'
    | 'cogs_of_projects'
    | 'gross_profit_of_projects'
    | 'gross_margin_of_projects'
    | 'total_admin_costs';

  detailHeaderZIndex: number;
  percentageValues?: boolean;
  titleClasses?: string;
  otherThanProject: 'cost_of_released' | 'cost_of_bench' | 'cost_of_juniors_bench';
  costOfBenchNest?: 'employees_fully_on_bench' | 'employees_partially_on_bench';
  totalValues: number[];
  sortingState?: SortingState;
};
