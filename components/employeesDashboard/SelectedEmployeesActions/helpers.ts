import { Employee } from 'types';

export const removeSelectedEmployeesFromArray = (
  employees: Employee[],
  selectedEmployees: number[],
) => {
  return employees.filter((employee) => !selectedEmployees.includes(employee.id));
};
