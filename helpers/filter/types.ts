import {
  Candidate,
  Employee,
  ProjectDashboard,
  TypeOfFilter,
  EmployeeVacations,
  VacationsArray,
  FilterCategory,
  RejectedCandidates,
  RejectedCandidatesInitial,
  Budgeting,
} from 'types';

export type GetAllSubCategoriesArgument = {
  type: FilterCategory;
  array: {
    [key: string]: any;
    id: number | string;
    children?: {
      [key: string]: any;
      id: number | string;
    }[];
  }[];
  filter_type: TypeOfFilter;
  shouldDefaultToAndInInsideCondition: boolean;
}[];

export type FilterableArrays =
  | Employee[]
  | Candidate[]
  | ProjectDashboard[]
  | EmployeeVacations[]
  | VacationsArray[]
  | RejectedCandidates[]
  | RejectedCandidatesInitial[]
  | Budgeting[];
