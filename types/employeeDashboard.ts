import { FilterOptions } from './filterTypes';
import { Employee } from './sharedTypes';

export type employeesInfo = {
  filterOptions: FilterOptions[];
  employees: Employee[] | never[];
  initialEmployees: Employee[] | never[];
  employeeTypeFilter: EmployeeFilterType;
};

export type EmployeeFilterType =
  | {
      employee: boolean | undefined;
      freelancer: boolean | undefined;
      preOffer: boolean | undefined;
    }
  | undefined;
