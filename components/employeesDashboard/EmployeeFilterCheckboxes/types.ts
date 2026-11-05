import { employeesInfo } from 'types/employeeDashboard';

export type Props = {
  filterProps: {
    employeesInfo: employeesInfo;
    employeeTypeChangeHandler: (
      arg0: 'employee' | 'freelancer' | 'preOffer',
      arg1: boolean,
    ) => void;
  };
  employeesAreLoading: boolean;
};
