import { Department, IncomeStatement } from 'types';

export type Props = {
  currency: 'USD' | 'GEL';
  income: IncomeStatement[];
  title: string;
  row:
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
  departments: Department[];
};
