import { PossibleAdditionalRevenue } from './home';
import { Term } from './projectsTypes';
import { MoneyInAllCurrency, Skills } from './sharedTypes';

export type EmployeeProfitabilityEmployee = {
  id: number;
  first_name: string;
  last_name: string;
  revenue_capacity: PossibleAdditionalRevenue;
  profitability_percentage: number;
  gross_revenue: MoneyInAllCurrency;
  excluded_offs: MoneyInAllCurrency;
  cost_of_projects: MoneyInAllCurrency;
  cost_of_bench: MoneyInAllCurrency;
  profitability: MoneyInAllCurrency;
  revenue: MoneyInAllCurrency;
  department: {
    id: number;
    title: string;
  };
  position: {
    id: number;
    title: string;
  };
  seniority: {
    id: number;
    title: string;
  };
  skills: Skills[];
  time_off_hours: number;
  projects: EmployeeProfitabilityProjectType[];
  terms: Term[];
};

export type EmployeeProfitabilityProjectType = {
  id: number;
  title: string;
  revenue: MoneyInAllCurrency;
  gross_revenue: MoneyInAllCurrency;
  excluded_offs: MoneyInAllCurrency;
  cost_of_projects: MoneyInAllCurrency;
};

export type EmployeeProfitabilityStatisticsType = {
  revenue_capacity: PossibleAdditionalRevenue;
  revenue: MoneyInAllCurrency;
  excluded_offs: MoneyInAllCurrency;
  gross_revenue: MoneyInAllCurrency;
  profit: MoneyInAllCurrency;
  total_cost: MoneyInAllCurrency;
  excluded_offs_percentage: MoneyInAllCurrency;
  gross_revenue_percentage: MoneyInAllCurrency;
  cost_of_projects: MoneyInAllCurrency;
  profit_percentage: MoneyInAllCurrency;
  cost_of_projects_percentage: MoneyInAllCurrency;
  cost_of_bench: MoneyInAllCurrency;
  cost_of_bench_percentage: MoneyInAllCurrency;
  employees: EmployeeProfitabilityEmployee[];
};

export type EmployeeProfitabilityHeadTypes =
  | 'revenue_capacity'
  | 'gross_revenue'
  | 'excluded_offs'
  | 'revenue'
  | 'cost_of_projects'
  | 'cost_of_bench'
  | 'profitability'
  | 'profitability_percent'
  | 'person'
  | 'position';
