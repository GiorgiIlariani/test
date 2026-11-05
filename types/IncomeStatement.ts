import { INCOME_HEADERS } from 'config';
import { Currency } from './sharedTypes';

export type IncomeStatementInputs = {
  id: number | null;
  name: string;
  departments?: string;
  department_id?: number | null;
  1: IncomeStatementInputsItem;
  2: IncomeStatementInputsItem;
  3: IncomeStatementInputsItem;
  4: IncomeStatementInputsItem;
  5: IncomeStatementInputsItem;
  6: IncomeStatementInputsItem;
  7: IncomeStatementInputsItem;
  8: IncomeStatementInputsItem;
  9: IncomeStatementInputsItem;
  10: IncomeStatementInputsItem;
  11: IncomeStatementInputsItem;
  12: IncomeStatementInputsItem;
  13: IncomeStatementInputsItem;
};

export type IncomeStatementInputsItem = {
  price: number | null;
  id: number | null;
  price_without_formatting?: number;
};

export type ListItem = { title: string; id: number | null; isChecked?: boolean };

export type OtherExpense = {
  department_id?: number | null;
  other_expense_id?: number;
  price: number;
  month: number;
  year: number;
  id?: number;
  price_without_formatting?: number;
  project?: {
    id: string;
    title: string;
    type: 'internal' | 'default';
  } | null;
};

export type OtherExpenseResponse = {
  id: number;
  title: string;
  project?: {
    id: string;
    title: string;
    type: 'internal' | 'default';
  } | null;
  records: {
    id: number;
    department_id: number | null;
    other_expense_id: number;
    price: number;
    month: number;
    year: number;
    price_without_formatting: number;
  }[];
};

export type IncomeStatement = {
  from: string;
  to: string;
  rates: {
    [key in Currency]: number;
  };
  revenue: {
    order?: number;
    total: number;
    projects: {
      id: number;
      title: string;
      total: number;
      'T&MTotal': number;
      show_in_excluded_time_offs: boolean;
      has_booked_term?: boolean;
      index?: number;
      employeesKeys?: string[];
      employees:
        | {
            [key: string]: {
              id: number;
              first_name: string;
              last_name: string;
              total: number;
            };
          }
        | never[];
    }[];
  };
  adjusted_revenue: IncomeStatement['revenue'];
  excluded_time_offs: IncomeStatement['revenue'];
  cogs_of_projects: IncomeStatement['revenue'];
  gross_profit_of_projects: IncomeStatement['revenue'];
  gross_margin_of_projects: IncomeStatement['revenue'];
  total_cogs: number;
  total_gross_profit: number;
  net_profit: number;
  net_profit_margin: number;
  other_than_project_cogs: {
    total: number;
    order?: number;
    cost_of_released: {
      total: number;
      employeesKeys?: string[];
      employees: IncomeStatement['revenue']['projects'][number]['employees'];
    };
    cost_of_bench: {
      total: number;
      employees_fully_on_bench: {
        total: number;
        employeesKeys?: string[];
        employees: IncomeStatement['revenue']['projects'][number]['employees'];
      };
      employees_partially_on_bench: {
        total: number;
        employeesKeys?: string[];
        employees: IncomeStatement['revenue']['projects'][number]['employees'];
      };
    };
    third_party_services: {
      total: number;
      expenses: OtherExpense[];
    };
  };
  total_admin_costs: {
    total: number;
    order?: number;
    admin_salaries: {
      total: number;
      departments: {
        [key: string]: {
          id: number;
          total: number;
          employees: IncomeStatement['revenue']['projects'][number]['employees'];
        };
      };
    };
    other_admin: IncomeStatement['total_admin_costs']['admin_salaries'];
    internal_project_costs: IncomeStatement['revenue'];
  };
};

export type IncomeProjectsRow = Pick<
  IncomeStatement,
  | 'revenue'
  | 'adjusted_revenue'
  | 'excluded_time_offs'
  | 'cogs_of_projects'
  | 'gross_profit_of_projects'
  | 'gross_margin_of_projects'
>;

export type IncomeStatementEmployee = {
  id: number;
  first_name: string;
  last_name: string;
  total: number;
};

export type MonthsType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

export type RowTitles =
  | 'revenue'
  | 'adjusted_revenue'
  | 'excluded_time_offs'
  | 'cogs_of_projects'
  | 'gross_profit_of_projects'
  | 'gross_margin_of_projects'
  | 'other_than_project_cogs'
  | 'total_admin_costs';

export type ParentRowData = {
  row: RowTitles;
  title?: string;
  detailHeaderZIndex?: number;
  percentageValues?: boolean;
  negativeValues?: boolean;
  order?: number;
};

export type SortingState = {
  name: (typeof INCOME_HEADERS)[number];
  sortedBy: 'asc' | 'desc' | '';
  current: boolean;
  index: number;
}[];
