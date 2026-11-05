import type { ClientDetailsFormValues } from 'schemas';
import { Billing, ProjectForm, Term } from './projectsTypes';
import { RateCard } from './settings';
import { Currency, Permission, ProjectType, Staff } from './sharedTypes';
import { Employee } from './sharedTypes';

export type BudgetNavTypes = 'Unpublished' | 'Published' | 'All' | 'Archived';

export type BudgetStatus = 'unpublished' | 'published' | 'archived';

export type BudgetApi = {
  all_budgets: Budgeting[];
  recent_budgets: Budgeting[];
};

export type Budgeting = {
  id: number;
  currency: Currency;
  internal_project_id: number;
  created_at: string;
  title: string;
  start_date: string;
  end_date: string;
  budget: number;
  total: number;
  are_public_holidays_counted: boolean;
  description: string | undefined;
  progress: number;
  terms: Term[];
  rate_card: RateCard | null;
  owner: Employee;
  project_title: string;
  project: ProjectForm;
  rate_card_id: number | null;
  status: BudgetStatus;
  project_type: ProjectType;
};

export type BudgetForm = {
  id?: number;
  internal_project_id: number | { id: number | string | null; title: string } | null;
  title: string;
  rate_card_id: number | null;
  currency: Currency;
  project_title: string;
  owner_id: string;
  owner?: { id: number; first_name: string; last_name: string; avatar: string | null };
  status: BudgetStatus;
  start_date?: string | null;
  end_date?: string | null;
  selected_term: number | string;
  subtotal: number | string;
  description: string | undefined;
  are_public_holidays_counted: boolean;
  project_type: ProjectType;
  project?: {
    id: number | null;
    title: string;
    start_date: string | null;
    end_date: string | null;
    currency: Currency;
    type: ProjectType;
    owner?: { id: number; first_name: string; last_name: string; avatar: string | null } | null;
  };
  terms?: any[];
  edited_term_id?: number | boolean;
  children?: any;
  parent?: any;
};

export type BudgetProject = {
  id: number | null;
  title: string;
  currency: Currency;
  start_date: string;
  end_date: string;
  type: ProjectType;
  department_id?: string | number | null;
  client_id?: string | number | null;
  owner: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
  };
};

export type BudgetIndexTypes = {
  avatar: string;
  permissions: Permission[];
  currentBudget: Budgeting;
};

export type BookModal = BudgetForm & {
  project_title: string;
  project_type: ProjectType;
  department_id?: string | number | null;
  client_id?: string | number | null;
  temporary_clients?: (ClientDetailsFormValues & { id: number })[];
  published_phase: PhasesForm[];
  draft_phase: PhasesForm[];
  draft: string;
  sumOfPublished: number;
  sumOfDraft: number;
  project_owner: number | null;
  children?: any;
  parent?: any;
};

export type BudgetTotals = {
  subtotal: number;
  free_of_charge: number;
  discount: number;
  total: number;
  cost: number;
  profit: number;
  profit_margin: number;
  missing: string;
  monthly_missing: string;
  by_month: {
    by_phase: BudgetTotalsPhase;
  } & MonthlyTerms;
  by_phase: BudgetTotalsTerm[];
  can_not_calculate: boolean;
  fee: number;
  has_expired: boolean;
  budgetId: number;
  budget_name: string;
};

export type BudgetTotalsPhase = {
  [phase: string]: {
    [month: string]: BudgetTotalsTerm;
  };
};

export type MonthlyTerms = {
  [month: string]: BudgetTotalsTerm;
};

export type BudgetTotalsTerm = {
  term_id?: number;
  term_name?: string;
  subtotal: number;
  free_of_charge: number;
  discount: number;
  total: number;
  cost: number;
  profit: number;
  profit_margin: number;
  missing: string;
  monthly_missing: string;
  type?: Billing;
  fee?: number;
};

export type PhasesForm = {
  id: number | null;
  item_id: number | null;
  name: string;
  type: Billing;
  title?: string;
  start_date: string;
  end_date?: string;
  work_days_count: number;
  discount: number | string;
  discount_duration?: number;
  discount_amount?: number | string;
  discount_toggle?: boolean;
  duration: number;
  employees: Staff[];
  term_roles?: Staff[];
  role: number | null;
  status: 'draft' | 'activate' | 'book' | 'actual' | 'booked';
  ready_to_book?: boolean;
  months?: number | string;
  days?: number | string;
  gross_profit?: number | null;
  cost?: number | null;
  total?: number | null;
  total_to_be_paid?: number | null;
  gross_profit_percentage?: number | null;
  budget_id?: number | null;
  children?: any;
  parent?: any;
};
