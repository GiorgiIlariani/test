import {
  Permission,
  Seniority,
  Position,
  Staff,
  Currency,
  ProjectType,
  Department,
  StaffMinimalEmployee,
} from './sharedTypes';
import type { ProjectClient } from './clientsTypes';
import { ExcludeEmployee, VacationType } from './vacations';
import { BudgetStatus, PhasesForm } from './Budget';
import { Recruiter } from './recruitmentPipeline';

export type ProjectsIndexTypes = {
  avatar: string;
  permissions: Permission[];
  minimalUsers: StaffMinimalEmployee[];
  projectOwners: Recruiter[];
  filter: string;
};

export type InvoicesIndexProps = {
  avatar: string;
  permissions: Permission[];
  filter: string;
};

export type TermHistoryTypes = {
  name: string;
  changed_by: string;
  changed_by_id: number | null;
  created_at: string;
  deleted_at: number | null;
  discount: number | null;
  discount_duration: number | null;
  end_date: string;
  id: number;
  internal_project_id: number;
  start_date: string;
  updated_at: string;
  staffs: Staff[];
  is_booked?: boolean;
  expired: boolean;
  statuses: string;
  totals: number;
};

export type Billing = 'default' | 'monthly' | 'fixed';
export type Term = {
  id?: number;
  author?: string;
  change_date?: string;
  start_date: string | null;
  end_date: string | null;
  staffs: Staff[];
  discount: number;
  discount_duration: number | undefined;
  currency: string;
  agreements: File[];
  internal_project_id?: number;
  vacations?: StaffingAndTermVacation[];
  is_booked?: boolean | 1 | 0;
  expired: boolean;
  name: string;
  type: Billing;
  fee: number;
  pivot?: { engagement: number };
  blocked_by?: number | null;
  blocked_id?: number | null;
  blocked: Term | null;
  blocker: Term | null;
  blocked_terms: BlockedTerm[];
  status?: TermStatus;
  internal_project: ProjectData;
  children?: any;
  parent?: any;
};

export type BlockedTerm = {
  id?: number;
  start_date: string;
  end_date: string | null;
  old_start_date: string;
  old_end_date: string | null;
  isForSending: 'true' | '';
  name: string;
  hasError?: boolean;
  isExpiredAfterUpdate?: boolean;
};

export type ProjectForm = {
  id: string | number;
  title: string;
  start_date: string;
  end_date: string;
  completion_date: string;
  owner_id: string;
  is_completed: boolean;
  currency: Currency;
  type: ProjectType;
  department: Department;
  client: ProjectClient | null;
  staffs: Staff[];
  discount: number | string;
  discount_duration: number;
  status: ProjectStatus;
  updated_at: string;
  payment_info: {
    discount: number;
    free_of_charge: number;
    monthly_fee: number;
    total: number;
  };
  terms: ProjectTerm[];
  current_month_working_days_count?: number;
  agreements: File[];
  vacations: StaffingAndTermVacation[];
  is_booked: boolean;
  auto_approve_time_logs?: boolean;
  auto_fill_time_logs?: boolean;
  logo?: string | null;
  work_days: number | null;
  passed_days: number | null;
  budgets?: { id: number; title: string; status: BudgetStatus; phase: PhasesForm[] }[];
};

export type AddProjectForm = {
  id: string | number;
  title: string;
  logo: File | string | null | undefined;
  owner_id: string | number | null;
  currency: Currency;
  type: ProjectType;
  department_id: number | null;
};

export type ProjectTerm = {
  id: number;
  name: string;
  discount: number;
  free_of_charge: number;
  total: number;
  total_to_be_paid: number;
  cost: number;
  gross_profit: number;
  gross_profit_percentage: number;
  start_date: string;
  end_date: string;
  is_booked: boolean;
  expired: boolean;
  type: Billing;
  blocked: Term | null;
  blocker: Term | null;
};

export type StaffingModule = {
  id: number;
  title: string;
  start_date: string;
  status: string;
  updated_at: string;
  owner_id: number;
  currency: Currency;
  terms: StaffingTerm[];
  roles: StaffingRoles[];
};

export type StaffingTerm = {
  id: number;
  internal_project_id: number;
  changed_by: string;
  changed_by_id: number;
  start_date: string;
  end_date: string;
  discount: string;
  discount_duration: 2;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  type: Billing;
  name: string;
  updated_at_from_ui: null;
  is_booked: number;
  fee: number;
  subtotal: number;
  free_of_charge_amount: number;
  discount_amount: number;
  status: 'actual' | 'draft' | 'booked';
  duration: number;
  blocked_by: null;
  engagement: number;
  rate: string;
  budget: number;
  progress: number;
  blocker: BlockedTerm | null;
  blocked: BlockedTerm | null;
  internal_project: ProjectForm;
  term_employees_pivot: StaffingEmployee[];
  employee?: StaffingEmployee;
  cost?: string | number;
};

export type StaffingRoles = {
  id: number;
  seniority: Seniority;
  position: Position;
  terms: StaffingTerm[];
};
export type StaffingEmployee = {
  id: number;
  term_id: number;
  employee_id: number | 'blank' | null;
  rate: string;
  engagement: number;
  is_free_of_charge: number;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  archived_at: string | null;
  position_id: number;
  seniority_id: number;
};

export type ProjectDetails = {
  title: string;
  owner_id: string;
  currency: Currency;
};

export type ProjectData = {
  title: string;
  owner_id: string;
  currency: Currency;
  client: ProjectClient | null;
  agreements: File[] | string;
  status: ProjectStatus;
};

export type ProjectStatus = 'pre-sale' | 'active' | 'completed';

export type EngagementMeasurementUnit = 'hr' | 'day';

/**
 * p = Paid
 * pp = Partially paid
 * np = Not paid
 */
export type PaidStatus = 'p' | 'pp' | 'np';

/**
 * r = Rejected
 * p = Pending
 * a = Approved
 */
export type ApprovalStatus = 'r' | 'p' | 'a';

export type ContractAsset = {
  internal_project_id: number | string | undefined;
  start_date: string;
  end_date: string;
  currency: Currency;
  payment_status: PaidStatus;
  partially_paid_amount: number | string | null;
  service_fee_payment_agreed: boolean;
  fee_given_in: Currency;
  invoice_name?: string;
  fee_shall_be_paid_in: Currency;
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  free_of_charge: number;
  staffs: Staff[];
  expenses: {
    name: string;
    price: number;
    vat_amount?: number;
    vat_id?: number;
  }[];
  engagement_measurement_unit?: EngagementMeasurementUnit;
  term_working_days_count?: number;
  employee_info_to_show_in_invoice: ('employee' | 'role')[];
  holidays: VacationHolidays[];
  vacations: StaffingAndTermVacation[];
  type?: string;
  terms: InvoiceTerm['terms'];
  fixed: InvoiceTerm['terms'];
  monthly: InvoiceTerm['terms'];
  discount?: number;
  discount_duration?: number;
  total_to_be_paid?: number;
  surcharge_percentage?: number | null;
  surcharge_amount?: number | null;
  bank_accounts: string[];
  custom_fields?: {
    label: {
      en: string;
      ka: string;
    };
    value: string;
  }[];
};

export type CreateInvoice = ContractAsset & {
  vat_amount?: number;
  vat_percentage: number | undefined;
  invoice_date?: string;
  previous_scope_start_date?: string;
  previous_scope_end_date?: string;
};

export type VacationHolidays = {
  holiday: string;
  date: string;
};

export type StaffingAndTermVacation = {
  employee_first_name: string;
  employee_id: number;
  employee_last_name: string;
  fallback_employee_id: null | number;
  is_excluded: ExcludeEmployee;
  end_date: string;
  vacation_id: number;
  start_date: string;
  type: VacationType;
  work_days_excluded: number;
  fallback_employee_first_name: string | null;
  fallback_employee_last_name: string | null;
  end_date_for_calculations?: string;
  excluded_amount: number;
};

export type Invoice = {
  id: number;
  generated_id: string;
  total: number;
  internal_project: {
    title: string;
  };
  employees: TMTerm['employees'];
  deleted: boolean | null | undefined;
  page_number: string | number;
  default: TMTerm;
  type: InvoiceTypes;
  approval_status: ApprovalStatus;
  engagement_measurement_unit: EngagementMeasurementUnit;
  current_month_working_days_count?: number;
  children?: any;
  parent?: any;
  is_revenue_invoice?: boolean;
} & ContractAsset &
  CreateInvoice;

export type InvoiceTerm = {
  terms: {
    completion_percent?: number;
    discount_amount: number;
    fee: number;
    id: number;
    name: string;
    total: number;
    total_to_be_paid: number;
    type: Billing;
    term_id: number;
    vat_amount?: number;
    vat_id?: number;
  }[];
};

type TMTerm = {
  employees: {
    engagement_in_hrs: number;
    id: number;
    is_free_of_charge: 1 | 0;
    rate: number;
    employee_id?: number;
    original_engagement_without_formatting?: number;
    role?: string;
    vat_id?: number | null;
  }[];
  holidays: CreateInvoice['holidays'];
  vacations: CreateInvoice['vacations'];
};

export type InvoiceCalculationResponse = {
  default: TMTerm;
  fixed: InvoiceTerm;
  monthly: InvoiceTerm;
  total: number;
  total_to_be_paid: number;
  discount_amount: number;
  free_of_charge_amount: number;
};

export type InvoiceResponse = InvoiceCalculationResponse & Invoice;

export type InvoiceTypes = 'invoice' | 'revenue' | 'contract asset' | 'proforma' | '';

export type TableWrapperTitles = 'Projects' | 'Terms' | 'Timesheets' | 'Staffing';

export type Budget = {
  terms: {
    id?: string | number | null;
    termId?: string | number | null;
    name: string;
    type: Billing;
    total?: number | string;
    total_budget?: number | string;
    final_total?: number | string;
    free_of_charge_amount?: number | string;
    discount?: number | string;
    duration?: number | string;
    final_sub_total?: number | string;
    index_number_in_ui?: number;
    discount_percentage?: number | string;
    discount_amount?: number | string;
    engagement: number | string;
    discount_duration?: number | string;
    internal_project_id?: number;
    status?: TermStatus;
    average_cost?: string;
    staffs: (Partial<Staff> & {
      name: string;
      hourly_rate: number | string;
      budget: number | string | null;
      position?: Position;
      seniority?: Seniority | null;
      position_id?: number;
      seniority_id?: number;
    })[];
    isActual?: boolean;
  }[];
  id?: number | null;
  roles: (TRateCard & Partial<RoleApi>)[];
  role_term: RoleTermApi[];
  term_type?: Billing;
  rate_card?: { id: number | string; name: string } | null;
  rate_card_name?: string | null;
  rate_card_id?: string | null;
  is_revenue_invoice?: boolean;
};

export type TRateCard = {
  name: string;
  hourly_rate: number | string;
  id: string | number;
  role_id?: string;
  position: Position;
  seniority: Seniority | null;
  employee_id?: number;
  global_role_id?: string | null;
  isActual?: boolean;
  isSeniorityUnset?: boolean;
};

export type RateCardSet = { [key: string]: TRateCard[] };

type BudgetTermsApiResponse = {
  id: number;
  rate: number;
  engagement: number;
  is_free_of_charge: 1 | 0;
  position: Position;
  position_id: number;
  seniority: Seniority | null;
  seniority_id: number;
  employee_id?: number;
};

export type RoleApiRequest = Pick<RoleApi, 'global_role_id' | 'index_number_in_ui'>;
export type TermApiRequest = Pick<
  TermApi,
  | 'id'
  | 'discount'
  | 'discount_duration'
  | 'duration'
  | 'name'
  | 'type'
  | 'total'
  | 'index_number_in_ui'
>;
export type RoleTermApiRequest = Pick<
  RoleTermApi,
  | 'engagement'
  | 'rate'
  | 'is_free_of_charge'
  | 'role_index_number_in_ui'
  | 'term_index_number_in_ui'
>;

export type BudgetApiRequest = {
  roles: RoleApiRequest[];
  terms: TermApiRequest[];
  role_term: RoleTermApiRequest[];
  rate_card_id: number | null;
};

type RoleApi = {
  id: string | number;
  global_role_id: string | number | null;
  internal_project_id: string;
  index_number_in_ui: number;
  global_role: BudgetTermsApiResponse;
};

type TermApi = {
  discount?: number | string;
  discount_duration?: number | string;
  discount_amount: number;
  duration: number | string;
  name: string;
  type: Billing;
  total: number | string;
  id?: string | number | null;
  index_number_in_ui: number;
  free_of_charge_amount: number | null;
  total_to_be_paid: number | string;
  status: TermStatus;
};

type RoleTermApi = {
  engagement: number;
  rate: number;
  is_free_of_charge: boolean;
  role_index_number_in_ui: number;
  term_index_number_in_ui: number;
  global_role_id: string;
  term_id: string;
};

export type BudgetApiResponse = {
  roles: RoleApi[];
  terms: TermApi[];
  role_term: RoleTermApi[];
  rate_card: { id: number; name: string } | null;
};

export type TimeSheetTableInitial = {
  [key in string]: {
    actual_hours: number;
    budgeted_hours: number;
    actual_revenue: number;
    budgeted_revenue: number;
    actual_cost: number;
    budgeted_cost: number;
    budgeted_profit: number;
    actual_profit: number;
    actual_margin: number;
    budgeted_margin: number;
    approved: boolean;
    start_date?: string;
  };
};

export type TimeSheetTable = {
  actual_hours: number;
  budgeted_hours: number;
  actual_revenue: number;
  budgeted_revenue: number;
  actual_profit: number;
  actual_cost: number;
  budgeted_profit: number;
  budgeted_cost: number;
  actual_margin: number;
  budgeted_margin: number;
  approved?: boolean;
  start_date?: string;
};

export type ProjectInvoicesBudget = {
  total: number;
  paid_amount: number;
  invoice_not_paid: number;
  not_invoiced: number;
};

export type TimeSheetEmployee = {
  first_name: string;
  last_name: string;
  position: string;
  seniority: string;
  time_logs: TimeSheetEmployeeCalculations[];
};
export type TimeSheetEmployeeCalculations = {
  actual_cost: number;
  hourly_salary: number;
  id: number;
  employee_id: number;
  term_id: number;
  actual_hours: number;
  budgeted_hours: number;
  date: string;
  approved: 1 | 0;
  created_at: null;
  updated_at: null;
};

export type TimeSheetEmployees = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  employee_calculations: { [key: string]: TimeSheetEmployee };
};

export type TimeSheetForm = {
  id: number;
  name: string;
  mon: TimeSheetWeekDays;
  tue: TimeSheetWeekDays;
  wed: TimeSheetWeekDays;
  thu: TimeSheetWeekDays;
  fri: TimeSheetWeekDays;
  sat: TimeSheetWeekDays;
  sun: TimeSheetWeekDays;
  employee_calculations: {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
    employee_id: number | null;
    term_id?: number;
    mon: TimeSheetCalculationsWeekDays;
    tue: TimeSheetCalculationsWeekDays;
    wed: TimeSheetCalculationsWeekDays;
    thu: TimeSheetCalculationsWeekDays;
    fri: TimeSheetCalculationsWeekDays;
    sat: TimeSheetCalculationsWeekDays;
    sun: TimeSheetCalculationsWeekDays;
  }[];
};

export type TimeSheetCalculationsWeekDays = {
  actual_hours: number;
  budgeted_hours: number;
  id: number;
};

export type TimeSheetWeekDays = {
  approved: boolean;
  date: string;
  fullDate: string;
  disabled: boolean;
};

export type TimeSheetUnionsForTotals =
  | 'actual_hours'
  | 'actual_revenue'
  | 'actual_cost'
  | 'actual_margin'
  | 'budgeted_hours'
  | 'budgeted_revenue'
  | 'budgeted_cost'
  | 'budgeted_margin'
  | 'actual_profit'
  | 'budgeted_profit';

export type TermStatus = 'actual' | 'booked' | 'draft' | 'expired' | 'activate' | 'book';

export type FilterState = {
  [key: string]: boolean;
};

export type StaffingTermType = {
  staffs: {
    role_id: number;
    position: Position;
    seniority: Seniority;
    original: boolean;
    shouldJoin: number | null;
    employee_id: number | 'blank' | null;
    terms: {
      term_id: number;
      employee_id: number | null;
      name: string;
      engagement: number;
      rate: string;
      status: string;
    }[];
  }[];
  terms: {
    id: number;
    name: string;
    type: 'fixed' | 'default' | 'monthly';
    workDays: number;
    blocked_by: number | null | 'blank';
    budget: number;
    start_date: string;
    end_date: string;
    subtotal: number;
    discount_amount: number;
    free_of_charge_amount: number;
    status: 'actual' | 'draft' | 'booked';
    progress: number | string | null;
    employees: StaffingEmployee[];
    cost?: string | number;
    gross_profit: number;
  }[];
  blocked_terms: BlockedTerm[];
};

export type EmployeeSalary = {
  id: number;
  seniority_id: number;
  position_id: number;
  position: Position;
  seniority: Seniority | null;
  salary: {
    salary: number;
    currency: Currency;
  } | null;
  converted_amount: number;
};

export type ProjectRevenuePeriod = {
  cost: number;
  revenue: number;
  profit: number;
  label: string;
};

export type ProjectRevenueWidget = {
  cost: number;
  revenue: number;
  profit: number;
  months: string[];
  quarters: string[];
  years: string[];
  monthly_calculations: ProjectRevenuePeriod[];
  quarterly_calculations: ProjectRevenuePeriod[];
  yearly_calculations: ProjectRevenuePeriod[];
};

export type TimeLogEntryStatus = 'draft' | 'submitted' | 'rejected' | 'approved' | 'none';

export type TimeLogEntry = {
  id?: number | null;
  item_id?: number | null;
  start_time: string;
  end_time: string;
  duration: number;
  notes?: string | null;
  note?: string | null;
  status: TimeLogEntryStatus;
  hour: number | string;
  minutes: number | string;
  term_id?: number;
  employee_id?: number;
  date?: string;
  time_log_id?: number;
};

export type TermTimeLogEntries = {
  id: number;
  name: string;
  budget: { id: number; title: string };
  employees: { employee_id: number; sort_index: number }[];
  time_logs: {
    id: number;
    actual_hours: number;
    approved: number;
    entries: TimeLogEntry[];
    time_log_entries: TimeLogEntry[];
  }[];
  total: { hours: number; minutes: number };
  status: TimeLogEntryStatus;
};

export type TimeLogEntries = {
  id: number;
  project_id: number;
  project_name: string;
  terms: TermTimeLogEntries[];
};

export type WeeklyReport = {
  [key: string]: {
    minutes: number;
    hours: number;
    status: TimeLogEntryStatus;
    projects: {
      project_id: number;
      project_name: string;
      terms: {
        id: number;
        name: string;
        budget: {
          id: number;
          title: string;
        };
        status: string;
        time_logs: null;
      }[];
    }[];
  };
};
