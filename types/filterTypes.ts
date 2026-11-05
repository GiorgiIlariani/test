import {
  BUDGET_FILTER_TOP_CATEGORIES,
  EMPLOYEE_LIST_FILTER_TOP_CATEGORIES,
  HEADCOUNT_REPORT_FILTER_TOP_CATEGORIES,
  INVOICE_DASHBOARD_FILTER_TOP_CATEGORIES,
  PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES,
  RECRUITMENT_BOARD_FILTER_TOP_CATEGORIES,
  REJECTED_CANDIDATES_FILTER_TOP_CATEGORIES,
  TRAFFIC_FILTER_TOP_CATEGORIES,
  USER_MANAGEMENT_FILTER_TOP_CATEGORIES,
  VACATIONS_FILTER_TOP_CATEGORIES,
  DRAFT_CAREER_LOGS_FILTER_TOP_CATEGORIES,
} from 'config';
import { Dispatch } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Budgeting,
  Employee,
  EmployeeVacations,
  PrivilegedUserEditFormFields,
  PrivilegedUsers,
  ProjectDashboard,
  RecruitmentColumn,
  RejectedCandidates,
  RejectedCandidatesInitial,
} from 'types';

export type FilterCategory =
  | (typeof EMPLOYEE_LIST_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof RECRUITMENT_BOARD_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof INVOICE_DASHBOARD_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof REJECTED_CANDIDATES_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof VACATIONS_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof TRAFFIC_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof USER_MANAGEMENT_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof BUDGET_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof HEADCOUNT_REPORT_FILTER_TOP_CATEGORIES)[number]['value']
  | (typeof DRAFT_CAREER_LOGS_FILTER_TOP_CATEGORIES)[number]['value'];

export type ConditionOperator = 'AND' | 'OR' | null;

export type TypeOfFilter = 'select' | 'date' | 'saved';

export type FilterOptions = {
  type: FilterCategory;
  value: string;
  isIsNot: boolean;
  ConditionIsAnd: boolean;
  id: number | string;
  childConditions: {
    value: string;
    ConditionIsAnd: boolean;
    id: number | string;
  }[];
  group: string;
  meta?: FilterMeta;
  filter_type: string;
};

export type FilterMeta = {
  startDate?: Date;
  endDate?: Date;
  filters?: FilterOptionsForApi[];
  isPrivate?: boolean;
  isMadeByThisUser?: boolean;
};

export type AddingInsideSelectedFilter = {
  type: string;
  value: string;
  meta: FilterMeta | undefined;
  id: number | string;
};

export type AllSubCategories = {
  type: string;
  [key: string]: any;
  id: number | string;
  shouldDefaultToAndInInsideCondition: boolean;
  filter_type: TypeOfFilter;
  meta?: FilterMeta;
  children?: AllSubCategories[];
};

export type FoundSubCategories = AllSubCategories;

export type FilterTopCategory = {
  readonly id: string;
  readonly name: string;
  readonly icon: any;
  readonly bg_color: string;
  readonly text_color: string;
  readonly value: string;
  readonly filter_type: TypeOfFilter;
};

export type EmployeeFilterAndSortReducerPayload = {
  filterOptions?: FilterOptions[];
  initialEmployees?: Employee[];
  employeeTypeFilter?: {
    employee: boolean | undefined;
    freelancer: boolean | undefined;
    preOffer: boolean | undefined;
  };
};

export type RecruitmentBoardFilterReducerPayload = {
  initialBoard?: {
    [key: string]: RecruitmentColumn;
  };
  formattedBoard?: {
    [key: string]: RecruitmentColumn;
  };
  form: UseFormReturn<{
    [key: string]: RecruitmentColumn;
  }>;
  filterOptions: FilterOptions[];
};

export type ProjectDashboardFilterReducerPayload = {
  initialProjectData: ProjectDashboard[];
  projects: ProjectDashboard[];
  filterOptions: FilterOptions[];
};

export type BudgetDashboardFilterReducerPayload = {
  initialBudgets: Budgeting[];
  budgets: Budgeting[];
  filterOptions: FilterOptions[];
};

export type RejectedCandidatesDashboardFilterReducerPayload = {
  initialRejectedCandidates: RejectedCandidatesInitial[];
  rejectedCandidates: RejectedCandidates[] | RejectedCandidatesInitial[];
  filterOptions: FilterOptions[];
};

export type RejectedCandidatesDashboardFilterReducerDispatch = Dispatch<{
  payload?: Partial<RejectedCandidatesDashboardFilterReducerPayload>;
  type: RejectedCandidatesDashboardDispatchType | 'GET_REJECTED_CANDIDATES';
}>;

export type UserManagementDashboardFilterReducerPayload = {
  initialUserManagementDashboard: PrivilegedUsers[];
  userManagementDashboard: PrivilegedUsers[];
  filterOptions: FilterOptions[];
  roles?: { id: number; name: string }[];
  data?: PrivilegedUserEditFormFields;
  userId?: number;
  status?: string[];
};

export type UserManagementDashboardFilterReducerDispatch = Dispatch<{
  payload?: Partial<UserManagementDashboardFilterReducerPayload>;
  type: UserManagementDashboardFilterReducerPayloadDispatchType | 'GET_USER_MANAGEMENT';
}>;

export type VacationsDashboardFilterReducerPayload = {
  initialVacations: EmployeeVacations[];
  vacations: EmployeeVacations[];
  filterOptions: FilterOptions[];
};

export type VacationsDashboardFilterReducerDispatch = Dispatch<{
  payload?: Partial<VacationsDashboardFilterReducerPayload>;
  type: VacationsDashboardDispatchType | 'GET_VACATIONS';
}>;

export type ProjectDashboardFilterReducerDispatch = Dispatch<{
  payload?: Partial<ProjectDashboardFilterReducerPayload>;
  type: ProjectDashboardDispatchType | 'RESET_PROJECTS';
}>;

export type BudgetDashboardFilterReducerDispatch = Dispatch<{
  payload?: Partial<BudgetDashboardFilterReducerPayload>;
  type: BudgetsDashboardDispatchType | 'RESET_PROJECTS';
}>;

export type RecruitmentBoardFilterReducerDispatch = Dispatch<{
  payload?: Partial<RecruitmentBoardFilterReducerPayload>;
  type: FilterReducerActionTypes | 'RESET_INITIAL_BOARD' | 'CARD_CLOSED';
}>;

export type EmployeeFilterAndSortReducerDispatch = Dispatch<{
  payload?: EmployeeFilterAndSortReducerPayload;
  type: string;
}>;

export type ProjectDashboardDispatchType = FilterReducerActionTypes | 'RESET_PROJECTS';

export type BudgetsDashboardDispatchType = FilterReducerActionTypes | 'RESET_PROJECTS';

export type RejectedCandidatesDashboardDispatchType =
  | FilterReducerActionTypes
  | 'GET_REJECTED_CANDIDATES';

export type UserManagementDashboardFilterReducerPayloadDispatchType =
  | FilterReducerActionTypes
  | 'GET_USER_MANAGEMENT'
  | 'CHANGE_USER_MANAGEMENT'
  | 'DELETE_USER'
  | 'FILTER_USER';

export type VacationsDashboardDispatchType =
  | FilterReducerActionTypes
  | 'GET_VACATIONS'
  | 'CLEAR_ALL_FILTER'
  | 'UPDATE_VACATIONS';

export type FilterReducerActionTypes =
  | 'SET_FILTER_OUTSIDE_CONDITION'
  | 'REMOVE_ENTIRE_FILTER'
  | 'CLEAR_ALL_FILTER'
  | 'SET_FILTER_CHILD_CONDITION'
  | 'SWITCH_CHILD_CONDITION_AND'
  | 'REMOVE_FILTER_CHILD_CONDITION'
  | 'SWITCH_CONDITION_IS'
  | 'SWITCH_CONDITION_AND';

export type FilterOptionsForApi = {
  condition_is_and: boolean;
  id: number | string;
  meta: {
    start_date: undefined | string;
    end_date: undefined | string;
  };
  negate_condition: boolean;
  type: string;
  value: string;
  child_conditions: {
    id: number | string;
    condition_is_and: boolean;
    value: string;
  }[];
};

export type SavedFilterFromApi = {
  name: string;
  is_private: boolean;
  page: string;
  filters: FilterOptionsForApi[];
  id: number;
  made_by_this_user: boolean;
};

export type AddingFilterOption = {
  type: string;
  value: string;
  isIsNot: boolean;
  ConditionIsAnd: boolean;
  overflown?: boolean;
  childConditions: {
    value: string;
    ConditionIsAnd: boolean;
    id: number | string;
  }[];
  id: number | string;
  isChild: boolean | undefined;
  shouldDefaultToAndInInsideCondition: boolean;
  meta?: FilterMeta;
  filter_type: string;
  department?: string;
  children?: AllSubCategories[];
};

export type FilterFieldData = {
  type: string;
  value: string;
  id: string | number;
  children?: AllSubCategories[];
};
