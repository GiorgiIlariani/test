import { Currency, Department, Seniority, Position, CareerChange } from './sharedTypes';

export type SalaryReportEmployee = {
  id: number;
  first_name: string;
  last_name: string;
  position: Position;
  seniority: Seniority;
  monthly: Record<string, MonthlyIncome>;
  yearly_total: YearlyTotal;
  department: Department;
  employment_type: string;
};

export type SalaryReport = SalaryReportEmployee[];

export type MonthlyIncome = {
  [key in Currency]: number;
} & {
  is_salary_draft: boolean;
  draft_date: string | null;
  career_changes: CareerChange[];
};

export type YearlyTotal = {
  [key in Currency]: number;
};

export type SalaryViewType = 'actual' | 'budget';

export type SalaryAmountType = 'gross' | 'net';

export type CellData = {
  employee_id: number;
  month: string;
};
