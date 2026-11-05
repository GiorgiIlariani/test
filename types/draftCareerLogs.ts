import {
  FilterOptionsForApi,
  SalaryPaymentType,
  Currency,
  CareerHistoryStatus,
  CareerChange,
  ActionTypes,
} from 'types';

export type Timeframe = 'all' | 'upcoming' | 'overdue';

export type DraftCareerLogEmployee = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  position: string;
  seniority: string;
  avatar: string | null;
};

export type DraftCareerLogEntryData = {
  meta?: {
    initiative?: string;
    reason?: string;
    voluntarity?: string;
    would_rehire?: boolean | 'yes' | 'no';
    compensation_enabled?: boolean;
    compensation_till?: string | null;
  };
  salary?: number;
  currency?: Currency;
  payment_type?: SalaryPaymentType;
  availability?: string;
  department?: string;
  seniority?: string;
  position?: string;
  job_type?: string;
  project?: string;
};

export type DraftCareerLogBaseRow = {
  id: number | string;
  employee: DraftCareerLogEmployee;
  date: string;
  department: string;
  status: CareerHistoryStatus;
  type: string;
};

export type DraftCareerLogLeafRow = DraftCareerLogBaseRow & {
  id: number;
  whats_changed: Partial<CareerChange>;
  changed_by: string;
  data: DraftCareerLogEntryData;
};

export type DraftCareerLogGroupRow = DraftCareerLogBaseRow & {
  id: string;
  type: ActionTypes | 'Multiple';
  whats_changed: null;
  changed_by: null;
  data: null;
  log_count: number;
  subRows: DraftCareerLogLeafRow[];
};

export type DraftCareerLogTableRow = DraftCareerLogLeafRow | DraftCareerLogGroupRow;

export type DraftCareerLog = {
  data: DraftCareerLogTableRow[];

  from: number;
  to: number;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;

  path: string;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;

  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
};

export type GetDraftCareerLogsPayload = {
  per_page: number;
  page: number;
  filter_options: FilterOptionsForApi[];
  timeframe: Timeframe;
  sort_by?: string;
  sort_order?: number;
  from?: string;
  to?: string;
};
