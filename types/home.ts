import { MoneyInAllCurrency } from './sharedTypes';

export type Capacity = {
  [key: string]: MoneyInAllCurrency;
};

export type PossibleAdditionalRevenue = {
  [key: string]: number | undefined;
} & DepartmentCostOfBench;

export type PeriodCalculation = {
  adjusted_revenue: MoneyInAllCurrency;
  cost_of_projects: MoneyInAllCurrency;
  projects_gross_profit: MoneyInAllCurrency;
  possible_additional_revenue: PossibleAdditionalRevenue;
  non_project_cogs: MoneyInAllCurrency;
  admin_costs: MoneyInAllCurrency;
  total_gross_profit: MoneyInAllCurrency;
  net_profit: MoneyInAllCurrency;
  total_gross_margin: MoneyInAllCurrency;
  label: string;
};

export type RevenueWidgetCalculation = {
  adjusted_revenue: MoneyInAllCurrency;
  capacity: Capacity;
  cost_of_projects: MoneyInAllCurrency;
  projects_gross_profit: MoneyInAllCurrency;
  possible_additional_revenue: PossibleAdditionalRevenue;
  non_project_cogs: MoneyInAllCurrency;
  admin_costs: MoneyInAllCurrency;
  total_gross_profit: MoneyInAllCurrency;
  total_gross_margin: MoneyInAllCurrency;
  net_profit: MoneyInAllCurrency;
  months: string[];
  quarters: string[];
  years: string[];
  monthly_calculations: PeriodCalculation[];
  quarterly_calculations: PeriodCalculation[];
  yearly_calculations: PeriodCalculation[];
};

export type DepartmentCostOfBench = {
  total: MoneyInAllCurrency;
  departments: {
    [key: string]: {
      [key: string]: MoneyInAllCurrency | number;
    };
  };
};

export type EmployeeBenchStats = {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  archived_at: string | null;
  seniority: string | null;
  position: string | null;
  bench: number;
  capacity: number;
  scheduled: number;
};

export type DepartmentBenchStats = {
  department_id: number;
  billable: number;
  bench: number;
  capacity: number;
  scheduled: number;
  employees: EmployeeBenchStats[];
};

export type BenchStats = {
  billable: number;
  bench: number;
  scheduled: number;
  capacity: number;
  possible_revenue: PossibleAdditionalRevenue;
  cost_of_bench: DepartmentCostOfBench;
  employees: EmployeeBenchStats[];
  departments: DepartmentBenchStats[];
};

export type DepartmentCalculation = {
  department_id: number;
  billable: number;
  utilized: number;
};

export type UtilizationPeriodCalculation = {
  billable: number;
  utilized: number;
  departments: DepartmentCalculation[];
  label: string;
};

export type UtilizationWidget = {
  months: string[];
  quarters: string[];
  years: string[];
  monthly_calculations: UtilizationPeriodCalculation[];
  quarterly_calculations: UtilizationPeriodCalculation[];
  yearly_calculations: UtilizationPeriodCalculation[];
};

export type UnpaidInvoice = {
  id: number;
  generated_id: string;
  overdue_date: string;
  is_overdue: boolean;
  project_id: number;
  project_title: string;
  total: MoneyInAllCurrency;
  status: 'upcoming' | 'overdue' | 'partially paid';
  invoice_date: string;
};

export type UnpublishedBudget = {
  id: number;
  title: string | null;
  ready_to_publish_terms: number;
  terms: number;
  project_id: number | null;
  project_title: string | null;
  total: MoneyInAllCurrency;
};

export type UnpublishedBudgets = {
  total: MoneyInAllCurrency;
  budgets: UnpublishedBudget[];
};
