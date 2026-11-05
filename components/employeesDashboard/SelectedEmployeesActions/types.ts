import { Employee, EmployeeFilterAndSortReducerDispatch, Permission, SetState } from 'types';

export type Props = {
  selectedEmployees: number[];
  setSelectedEmployees: SetState<number[]>;
  dispatchEmployeeInfo: EmployeeFilterAndSortReducerDispatch;
  employees: Employee[];
  permissions: Permission[];
};
