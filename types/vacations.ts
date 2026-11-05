import { Department, ProjectType } from './sharedTypes';

export type VacationForm = {
  type: string;
  start_date: string;
  end_date: string;
  comment: string;
  reviewers: {
    name?: string;
    avatar?: string;
    id?: number;
    required?: boolean;
    final_reviewer?: 1 | 0;
  }[];
  sick_notes: File[];
};

export type EmployeeVacations = {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  leave_date: string | Date;
  join_date: string | Date;
  job_type: string;
  request_date: string;
  department: Department;
  seniority: {
    id: number;
    title: string;
  };
  position: {
    id: number;
    title: string;
  };
  projects: { id: number; title: string }[];
  vacations: VacationsArray[];
  total_vacation_days_per_month: {
    rejected: {
      month: string;
    };
    approved: {
      month: string;
    };
    pending: {
      month: string;
    };
  };
  employee?: {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
  };
  vacation_periods: VacationPeriod[];
  review_year?: number;
};

export type VacationPeriod = {
  from: string;
  to: string;
  cycle_number: number;
  is_the_first_cycle: boolean;
  sub_cycles: {
    from: string;
    to: string;
    is_bonus_days_period: boolean;
    vacation_days_used: number;
    available_vacation_days: number;
    extra_vacation_days_used: number;
    sick_days_used: number;
  }[];
};

export type InternalProjects = {
  id: number;
  title: string;
  is_excluded: ExcludeEmployee;
  excluded_work_days: number;
  read_only?: 1 | 0;
  type: ProjectType;
  fallback_employee:
    | {
        id: number;
        first_name?: string;
        last_name?: string;
        name?: string;
        avatar: string;
      }
    | null
    | ''
    | string
    | number;
};

export type VacationsArray = {
  id?: number;
  type: VacationType;
  status: VacationStatus;
  request_date: string;
  start_date: string;
  end_date: string;
  comment: string;
  asking_for: string;
  bulletin: null | number;
  internal_projects: InternalProjects[];
  reviewers: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    status: VacationStatus;
    status_changed_at: string | Date;
    final_reviewer: boolean;
    delete_reviewer: 1 | 0;
  }[];
  number_of_vacation_days_in_month: NumberOfVacationDaysInMonth;
  sick_notes:
    | {
        id: number;
        name: string;
        size: number;
      }[]
    | File[];
  employee_id: number;
  employee?: {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    department: Department;
  };
  delete_requested: 1 | 0;
  department?: {
    id: number;
    title: string;
  };
};
export type ExcludeEmployee = 'fully' | 'partially' | 'no';
export type VacationStatus = 'pending' | 'approved' | 'rejected';
export type VacationType = 'vacation' | 'sick leave' | 'parental leave' | 'unpaid leave';

export interface NumberOfVacationDaysInMonth {
  [key: string]: number;
}
export type VacationsReview = {
  id?: number;
  asking_for: string;
  end_date: string;
  start_date: string;
  bulletin: null | number;
  comment: string;
  sick_notes:
    | {
        id: number;
        name: string;
        size: number;
      }[]
    | File[];
  internal_projects: InternalProjects[];
  reviewers: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    status: VacationStatus;
    status_changed_at: string | Date;
    final_reviewer: boolean;
    delete_reviewer: 1 | 0;
  }[];
};
