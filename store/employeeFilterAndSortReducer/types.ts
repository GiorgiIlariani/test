import { EmployeeFilterAndSortReducerPayload } from 'types';
import { employeesInfo } from 'types/employeeDashboard';

export type ReducerProps = (
  state: employeesInfo,
  action?: {
    payload: EmployeeFilterAndSortReducerPayload;
    type: string;
  },
) => employeesInfo;
