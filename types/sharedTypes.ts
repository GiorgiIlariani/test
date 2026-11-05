import { PERMISSIONS, PROJECT_TYPE } from 'config';
import { ApprovalStatus, Billing, PaidStatus, ProjectStatus, TermStatus } from './projectsTypes';
import { FieldError } from 'react-hook-form';
import Pusher from 'pusher-js/types/src/core/pusher';
import { Achievements, Courses, Languages, SectionInfo } from './employeePage';
import { BudgetForm } from './Budget';
import { SalaryPaymentType } from './formDataTypes';
import type { ProjectClient } from './clientsTypes';

export type Department = {
  id: number;
  title: string;
  order?: number;
  is_billable?: 0 | 1;
};

export type Position = {
  id: number;
  title: string;
  order?: number;
};

export type Seniority = {
  id: number;
  title: string;
  parent_id: number | null;
  order?: number;
  children?: any[];
  parent?: any | null;
};

export type PositionSeniority = {
  position: Position;
  seniority: Seniority | null;
  id: number;
  title: string;
  global_role_id: string;
  isSeniorityUnset?: boolean;
};

export type GlobalRole = {
  position: Position;
  seniority: Seniority | null;
  id: string | number;
  title: string;
};

export type ProjectTitle = {
  id: number;
  title: string;
  order?: number;
};

export type Skill = {
  update?: JSX.Element;
  competency_rate?: number | 'blank' | null;
  experience_duration?: number | string;
  months_of_experience: number;
  years_of_experience: number;
  id: number;
  is_preferred?: boolean | number;
  title: string;
  isSelected: boolean;
  type: string;
  localId: number;
  color: string;
  updatable?: boolean;
};

export type Skills = {
  id: number;
  title?:
    | {
        en: string;
        ka: string;
      }
    | string;
  created_at?: string;
  updated_at?: string;
  color?: string;
  order?: number;
  competency_rate?: string | number;
  skill_id?: number | string;
  is_preferred?: 1 | 0 | boolean;
  months_of_experience?: number | string;
  years_of_experience?: number | string;
  canNotEdit?: boolean | undefined;
  isNew?: boolean;
  skill_order?: number;
  experience_duration?: number;
  pivot?: {
    user_id: number;
    skill_id: number;
    experience_duration: number;
    is_preferred: number;
    monthly_update_date: number | null;
    skill_order?: number;
    competency_rate?: number;
  };
};

export type Project = {
  title: string;
  description: string;
  company: string;
  industry: { id: number; name: string } | null;
  role: string;
  responsibility: string;
  technology?: Skill[] | [];
  skills?: Skill[];
  start_date: string;
  end_date: string;
  id: number | null;
  project_id?: number | null;
  updated?: boolean;
  media?: { id: number; name: string } | null;
  file?: File | { id: number; name: string } | string | null;
  media_link?: string;
  industry_id?: number | string;
  is_currently_working?: boolean | string | number;
  order?: number;
  is_preferred?: boolean;
};

export type Company = {
  position: string | number;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  id: number | null | undefined;
};

export type AuthUser = {
  active: boolean;
  avatar: string;
  email: string;
  first_name: string;
  name: string;
  id: number;
  last_name: string;
  permissions: Permission[];
  role: string;
  show_recruitment_table?: boolean;
  title: string;
  is_billable?: 0 | 1 | boolean;
};

export type Employee = {
  availability: string;
  avatar: string;
  created_at: string;
  work_email?: string;
  cv:
    | {
        id: number;
        name: string;
        size: number;
      }
    | undefined;
  department: Department;
  email: string;
  english_proficiency: string;
  first_name: string;
  id: number;
  id_number: string;
  job_type: string;
  join_date: string;
  last_name: string;
  leave_date: string;
  personal_email: string;
  archived_at: string | null;
  phone: string;
  position: Position;
  seniority: Seniority;
  primary_skills?: Skill[];
  secondary_skills?: Skill[];
  profile_completion: {
    percentage: string | number;
    unfilled: (keyof EmployeeFormFieldDefaults)[];
  };
  skills?: Skills[] & Skill[];
  last_updated_by?: { id: number; name: string; avatar: string | null } | null;
  updated_at_from_ui?: string;
};

export type EmployeeDetails = {
  join_date: string;
  position: string;
  seniority: string;
  salary: number;
  salary_currency: Currency;
  department: string;
  leave_date: string;
  work_email: string;
  job_type: string;
  availability: string;
  email?: string;
};

export type UpdateEmploymentDetailsPayload = {
  department_id?: number | null;
  seniority_id?: number | null;
  position_id?: number | null;
  join_date?: string | null;
  job_type?: string | null;
  availability?: string | null;
  email: string;
  salary?: number | null;
  salary_currency?: string | null;
};

export type EditPersonalInformationPayload = {
  first_name: string;
  last_name: string;
  street_address?: string | null;
  id_number?: string | null;
  personal_email?: string | null;
  phone?: string | null;
  zip_code?: string | null;
  location?: string | null;
};

export type UserRelation = {
  readonly id: number | string;
  readonly type?: string;
  readonly avatar?: string;
  readonly title: string;
};

export type Education = {
  university: string;
  faculty: string;
  start_date: string;
  finish_date: string;
  degree: string;
  id: string | number | undefined | null;
  education_id?: string | number;
  description?: string;
  attach_link?: string;
  certification?: null;
  current?: boolean;
  order?: number;
  is_preferred?: boolean;
};

export type EmployeeFormPreFilledFields = {
  first_name: string;
  last_name: string;
  join_date: string;
  leave_date: string;
  salary: {
    id: number;
    salary: number | null;
    currency: Currency | null;
    payment_type: SalaryPaymentType;
  };
  salary_start_date?: string;
  email: string;
  position_id: number | null | string;
  seniority_id: number | null | string;
  department_id: number | null | string;
  job_type: string;
  availability: string;
};

export type EmployeeFormFieldDefaults = {
  primary_stack: Skill[] | [];
  secondary_stack: Skill[] | [];
  projects: Project[];
  companies: Company[];
  avatar: string | File;
  city: string;
  street_address: string;
  id_number: string;
  personal_email: string;
  phone: string;
  work_experience: string;
  brief_intro: string;
  english_proficiency: string;
  educations: Education[];
  education: Education[];
  employees?: PrivilegedUsers[];
  skills?: Skill[];
  languages?: Languages[];
  courses?: Courses[];
  achievement?: Achievements[];
  profile_sections: SectionInfo[];
  sections?: SectionInfo[];
  cv_link: string;
  job_title?: Position;
  seniority?: number;
  variant?: 'RDBRD' | 'whitelabel';
  cv:
    | {
        id: number;
        name: string;
        size: number;
      }
    | File
    | null;
} & EmployeeFormPreFilledFields;

export type AnyObject = {
  [key: string]: any;
};

export type Permission = (typeof PERMISSIONS)[number];

export type PrivilegedUsers = {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  permissions: Permission[];
  avatar: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
};

export type SelectedStack = {
  isSelected: boolean;
  competence_rate?: number | null;
  experience_duration?: number;
  id: number;
  is_preferred?: boolean | number;
  localId: number;
  title?: string;
  color?: string;
};

export type PrefillInputNames = {
  department_id?: FieldError;
  email?: FieldError;
  first_name?: FieldError;
  last_name?: FieldError;
  join_date?: FieldError;
  position_id?: FieldError;
  seniority_id?: FieldError;
};

declare global {
  interface Window {
    pusher: typeof Pusher;
  }
}

export type Notification = {
  id: number;
  candidate_id?: number;
  notification_type: NotificationTypes;
  seen: number;
  created_at: string;
  from_user: {
    id: number;
    avatar: string | null;
    name: string;
  };
  data?: {
    invoice_id?: number;
    invoice_number?: string;
    vacation_id?: number;
    reviewer?: string;
    type?: string;
    notificationData?: string;
    user?: string;
    start_date?: string;
    end_date?: string;
    project_title?: string;
    project_id?: number;
    term_id?: number;
    term_crud_type?: 'created' | 'edited' | 'deleted';
    title?: string;
    terms?: { id: number; name: string }[];
    should_show_in_project?: boolean;
    project_ids?: (number | string)[];
    generated_id?: string;
    term_name?: string;
    number_of_weeks?: string;
    should_show_to_user?: boolean;
    action_to_take?: boolean;
    overdue_date?: string;
    avatar?: string;
    first_name?: string;
    last_name?: string;
  };
  recruitment_stage?: string;
  comment_id?: number;
};

export type GetNotificationTypeReturn = {
  type: 'vacation' | 'invoice' | 'recruitment' | 'project' | 'time logs' | 'career logs' | '';
  meta: {
    rejected?: boolean;
    review?: boolean;
    deleted?: boolean;
  };
};

export type NotificationTypes =
  // FYI i did not decide this first three
  | 'm' // mention
  | 'c' // comment
  | 'r' // reply
  | 'created invoice'
  | 'approved invoice'
  | 'rejected invoice'
  | 'edited invoice'
  | 'requested vacation'
  | 'requested sick leave'
  | 'requested parental leave'
  | 'vacation approved'
  | 'rejected vacation'
  | 'requested vacation delete'
  | 'vacation updated'
  | 'vacation additional fields updated'
  | 'vacation deleted'
  | 'rejected vacation delete'
  | 'vacation is approaching'
  | 'cfo created invoice'
  | 'internal project created'
  | 'internal project completed'
  | 'term crud'
  | 'term end date is approaching'
  | 'term expired'
  | 'term expiring'
  | 'time log review overdue'
  | 'invoice overdue'
  | 'draft career log expiring';

export type Staff = {
  name?: string;
  employee_id?: number | null | string;
  rate: number;
  engagement: number;
  is_free_of_charge: 1 | 0 | boolean;
  id: number | null;
  item_id?: number | null;
  total?: number;
  new?: boolean;
  original_engagement_without_formatting?: number;
  engagement_measurement_unit?: 'hr' | 'day';
  engagement_in_hrs?: number | string;
  seniority?: Seniority | null;
  position?: Position;
  role_seniority?: Seniority;
  role_position?: Position;
  budget?: number | string;
  position_id?: number | null;
  seniority_id?: number | null;
  role?: number | string;
  global_role_id?: number | null;
  duration?: string | number | null;
  global_role?: {
    id: number;
    position: Staff['position'];
    seniority: Staff['seniority'];
  };
  sort_index?: number;
  hours?: number | string;
  start_day?: number | null;
  discount_duration?: number | null;
  vat_amount?: number;
  vat_id?: number;
  start_date?: string;
  end_date?: string;
};

export type StaffMinimalEmployee = {
  id: number;
  title: string;
  name?: string;
  position: Position;
  seniority: Seniority;
  avatar?: string | undefined;
  archived_at?: string | null;
  employee_id?: number;
  skills: Skill[];
  department: Department;
  job_type?: string;
};

export type Currency = 'USD' | 'EUR' | 'GBP' | 'GEL' | '';

export type ProjectType = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];

export type ProjectDashboard = {
  id: number;
  owner_id: number;
  title: string;
  start_date: string;
  end_date: string | null;
  currency: Currency;
  status: ProjectStatus;
  client: ProjectClient | null;
  type: ProjectType;
  created_at: string;
  updated_at: string;
  employee_count: number;
  discountDuration: number | null;
  total_to_be_paid: number | null;
  gross_profit_percentage: number;
  discountTill: string;
  discount: number;
  free_of_charge: number;
  monthly_fee: number;
  total: number;
  monthly_fee_in_original_currency: number;
  cost: number;
  gross_profit: number;
  deleted_at: string | null;
  employee_ids: number[];
  active_employee_ids: number[];
  owner?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  owner_name: string;
  terms:
    | {
        start_date: string;
        end_date: null | string;
        status: TermStatus;
        employees: Employee[];
      }[];

  is_completed?: string;
  released?: MoneyInAllCurrency;
  to_be_released?: MoneyInAllCurrency;
  total_revenue?: MoneyInAllCurrency;
  logo?: string | null;
  owner_avatar?: string | null;
  current_terms?: CurrentTerm[];
  current_month?: MoneyInAllCurrency;
  department_id?: number | null;
  client_id?: number | null;
};

export type MoneyInAllCurrency = {
  [key: string]: number;
};

export type BackendMedia = {
  id: number;
  size: number;
  name: string;
};

export type FileUploadValue = File | BackendMedia;

export type CurrentTerm = {
  id: number;
  name: string;
  work_days: number;
  passed_days: number;
  start_date: string;
  end_date: string;
  budget: BudgetForm;
};
export type InvoiceDashboard = {
  current_page: number;
  data: InvoiceList[];
  first_page_url: string;
  next_page_url: string;
  prev_page_url: string;
  last_page_url: string;
  path: string;
  per_page: number;
  from: number;
  to: number;
  last_page: number;
  total: number;
  links: {
    url: string;
    label: string;
    active: boolean;
  }[];
};

export type InvoiceEmailDetails = {
  from_email: string | null;
  smtp_configured: boolean;
  to_recipients: string[];
  cc_recipients: string[];
  bcc_recipients: string[];
  subject: string | null;
  body: string | null;
  language: 'en' | 'ka';
  attachment_name: string;
};

export type InvoiceEmailPayload = {
  to_recipients: string[];
  cc_recipients: string[];
  bcc_recipients: string[];
  subject: string;
  body: string;
  language: 'en' | 'ka';
  resend?: boolean;
};

export type InvoiceEmailEventState = {
  id: number;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  sent_at: string | null;
  failure_reason: string | null;
};

export type InvoiceEmailEvent = InvoiceEmailEventState & {
  can_retry: boolean;
  type: 'initial' | 'follow_up_1' | 'follow_up_2';
  from_email: string;
  to_recipients: string[];
  cc_recipients: string[];
  bcc_recipients: string[];
  subject: string;
  body: string;
  attachment_name: string | null;
  attachment_available: boolean;
  initiated_by: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
};

export type InvoiceList = {
  id: number;
  generated_id: string;
  invoice_date: string;
  payment_status: PaidStatus;
  approval_status: ApprovalStatus;
  internal_project_id: string;
  total: MoneyInAllCurrency;
  discount_amount: MoneyInAllCurrency;
  free_of_charge: MoneyInAllCurrency;
  total_to_be_paid: MoneyInAllCurrency | null;
  currency: Currency;
  partially_paid_amount: number | null;
  latest_initial_email_event: Pick<InvoiceEmailEventState, 'id' | 'status' | 'created_at'> | null;
  email_sent_at: string | null;
  email_events_count: number;
  internal_project: {
    id: number;
    owner_id: number;
    title: string;
    currency: Currency;
    client: {
      id: number;
      name: string;
      payment_deadline_in_days: number;
      payment_deadline_type: 'w' | 'c';
    } | null;
    owner: { id: number; first_name: string; last_name: string } | null;
  };
  deadline_details: {
    due_date: string;
    status: 'upcoming' | 'due_today' | 'overdue';
    days: number;
    unit: 'calendar' | 'business';
  } | null;
  type: 'invoice' | 'revenue' | 'contract asset';
};

export type SelectedInvoices = {
  invoiceId: number;
  status: ApprovalStatus;
  paid_status: PaidStatus | null;
};

export type RejectedCandidateData = {
  candidate_id: number;
  rejected_by: number;
  rejection_reason: string;
  rejected_at: string;
  would_follow_up: boolean | string;
  follow_up_preferred_time: number | undefined;
  rejection_comment: string;
};

export type UserOrganization = {
  id: string;
  active: boolean;
  name: string;
  notification_sum: number;
  logo: string;
};

export type AdvancedSelectList = {
  id: number | string | null;
  title: string;
  type?: Billing;
};

export type SectionIconVariant = 'middle' | 'top' | 'bottom';

export type CareerHistoryStatus = 'active' | 'draft';

export type CareerChange = {
  type: string;
  prev: number | string | null;
  current: number | string;
  prev_currency: Currency | null;
  current_currency: Currency | null;
  state: string;
  status?: string;
  voluntarily: string | null;
  date: string;
};
