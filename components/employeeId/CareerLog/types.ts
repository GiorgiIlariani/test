import { Currency, Permission, SalaryPaymentType, ShowPageEmployee } from 'types';

export type Props = {
  careerLogEmployeeData: EmployeeMiniData;
  actionsAreAdded: boolean;
  employee: ShowPageEmployee;
  refetchEmployees: () => void;
  permissions: Permission[];
  defaultCurrency: Currency;
};

export type EmployeeMiniData = {
  position: string;
  seniority: string;
  updatedDate: string;
  salary: string | number;
  payment_type: SalaryPaymentType;
  project: string;
  currency: Currency;
};
