import { FULL_MONTH_NAMES, PARTIAL_QUARTER_NAMES } from 'config';
import { CareerChange, Currency } from './sharedTypes';

export type HCMonthData = {
  headcount: number;
  costs: Record<Currency, number>;
  career_changes?: CareerChange[];
};

export type HCMonthMap = Record<string, HCMonthData>;

export type HCEmployee = {
  name: string;
} & PeriodMap;

export type HCChildSeniority = {
  name: string;
  employees: HCEmployee[];
} & PeriodMap;

export type HCSeniority = {
  name: string;
} & PeriodMap &
  (
    | { children: HCChildSeniority[]; employees?: never }
    | { employees: HCEmployee[]; children?: never }
  );

export type HCPosition = {
  name: string;
  seniorities: HCSeniority[];
} & PeriodMap;

export type PeriodMap = {
  [key in PeriodKey]: HCMonthMap;
};

export type HCTable = {
  monthly: HCPosition[];
  quarterly: HCPosition[];
  totals: HCTotals;
};

export type HCForm = {
  type: 'Headcount' | 'Cost';
  period: 'monthly' | 'quarterly';
};

export type PeriodKey = 'months' | 'quarters';

export type MonthlyHCSortingState = {
  name: (typeof FULL_MONTH_NAMES)[number];
  sortedBy: 'asc' | 'desc' | '';
  current: boolean;
  index: number;
}[];

export type QuarterlyHCSortingState = {
  name: (typeof PARTIAL_QUARTER_NAMES)[number];
  sortedBy: 'asc' | 'desc' | '';
  current: boolean;
  index: number;
}[];

export type HCTotals = {
  resources: number;
  new_hires: number;
  terminations: {
    total: number;
    voluntary: number;
    involuntary: number;
  };
  headcount: {
    start_year: number;
    end_year: number;
  };
};
