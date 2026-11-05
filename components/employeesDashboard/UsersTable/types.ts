import { Employee, EmployeeFilterAndSortReducerDispatch, Permission, SetState } from 'types';
import { employeesInfo } from 'types/employeeDashboard';

export type Props = {
  employees: Employee[];
  dispatchEmployeeInfo: EmployeeFilterAndSortReducerDispatch;
  initialEmployees: Employee[];
  permissions: Permission[];
  employeesAreLoading: boolean;
  setEmployeesAreLoading: SetState<boolean>;
  filterProps: {
    employeesInfo: employeesInfo;
    employeeTypeChangeHandler: (
      arg0: 'employee' | 'freelancer' | 'preOffer',
      arg1: boolean,
    ) => void;
  };
  toggleInviteUserModal: () => void;
};
