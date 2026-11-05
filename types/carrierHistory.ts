import { SalaryPaymentType, CareerHistoryStatus, Currency } from 'types';

export type ActionTypes =
  | 'Started working'
  | 'Department'
  | 'Seniority'
  | 'Salary'
  | 'Position'
  | 'Availability'
  | 'Job type'
  | 'On boarded'
  | 'Off boarded'
  | 'Termination'
  | 'Re-employed'
  | '';

export type ActionForm = {
  user_id: number;
  date: string;
  status: CareerHistoryStatus;
  type: ActionTypes[];
  department_id: number;
  seniority_id: number;
  position_id: number;
  salary: number;
  net_salary?: number | string;
  currency: Currency;
  payment_type: SalaryPaymentType;
  meta: {
    voluntarity: string;
    reason: string;
    would_rehire: boolean | 'yes' | 'no';
    initiative: string;
    compensation_enabled?: boolean;
    compensation_till?: string | null;
  };
  salary_change_reason: string | undefined;
  career_historable_id?: number | undefined;
  position: string;
  seniority: string;
  department: string;
  amount?: number;
  initiative?: string;
  would_rehire?: boolean;
  reason?: string;
  availability?: string;
  job_type?: string;
};

export type CareerHistory = {
  id: number;
  user_id: number;
  type: ActionTypes;
  date: string;
  status: CareerHistoryStatus;
  data: {
    seniority?: string;
    position?: string;
    department?: string;
    termination?: string;
    salary?: string;
    payment_type?: SalaryPaymentType;
    currency?: Currency;
    project?: string;
    availability?: string;
    job_type?: string;
    meta?: {
      reason?: string;
      worked_for?: string;
      voluntarity?: string;
      would_rehire?: boolean | 'yes' | 'no';
      promotion?: boolean;
      increase?: boolean;
      payment_method_changed?: boolean;
      initiative?: string;
      percentage?: number;
      bench?: boolean;
      compensation_enabled?: boolean;
      compensation_till?: string;
    };
  };
  updated_at: string;
  career_historable_id: number;
  career_historable: {
    project_current_name: string;
  };
};

export type CareerLogDetail = {
  id: number;
  created_at: string;
  changed_by: {
    id: number;
    name: string;
  };
  date: string;
  type: ActionTypes;
  start_date: string | Date;
  status: CareerHistoryStatus;
  data: {
    meta?: {
      reason?: string;
      worked_for?: string;
      voluntarity?: string;
      would_rehire?: boolean | 'yes' | 'no';
      promotion?: boolean;
      increase?: boolean;
      initiative?: string;
      percentage?: number;
      compensation_till?: string;
      compensation_enabled?: boolean;
    };
    project_id?: number;
    salary?: string;
    payment_type?: SalaryPaymentType;
    currency?: Currency;
    position?: String;
    department?: string;
    seniority?: string;
    availability?: string;
    job_type?: string;
    project?: string;
    employee?: {
      id: number;
      name: string;
      position: {
        id: number;
        title: string;
      };
      seniority: {
        id: number;
        title: string;
      };
      rate: number | null;
      free_of_charge: number | null;
      engagement: number | null;
      project_current_name: string;
      currency?: Currency;
    };
  };
  career_historable: {
    id: number;
    created_at: string;
    title: { en: string; ka: string };
    updated_at: string;
  };
};

export type CareerHistoryHeader = {
  position: string;
  positionDate: string;
  position_id?: number;
  seniority: string;
  seniorityDate: string;
  seniority_id?: number;
  salary: string;
  salaryDate: string;
  salaryPaymentType: SalaryPaymentType;
  currency: Currency;
  project: string;
  department?: string;
  department_id?: number;
};

export type UserProject = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  terms: {
    id: number;
    start_date: string;
    end_date: string;
    internal_project_id: number;
  }[];
};

export type CareerLog = {
  checked: boolean;
  id: number;
  title: string;
  value: string;
};
