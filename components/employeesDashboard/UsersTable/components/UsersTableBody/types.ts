import { Employee } from 'types';

export type UsersTableBodyProps = {
  employees: Employee[];
  selectedEmployees: number[];
  onEmployeeSelect: (employeeId: number, checked: boolean) => void;
  onViewSkills: (employee: Employee) => void;
};
