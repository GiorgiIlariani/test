import { useRouter } from 'next/router';
import { useState } from 'react';
import { Employee } from 'types';
import { getDefaultArchiveActiveState } from './helpers';

export const useUsersTable = (employees: Employee[]) => {
  const router = useRouter();
  const [activeArchive, setActiveArchive] = useState(getDefaultArchiveActiveState(router));
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [skillsModalEmployee, setSkillsModalEmployee] = useState<Employee | null>(null);

  const toggleAllSelected = (checked: boolean) => {
    setSelectedEmployees(checked ? employees.map((employee) => employee.id) : []);
  };

  const toggleEmployeeSelected = (employeeId: number, checked: boolean) => {
    setSelectedEmployees((selected) =>
      checked ? [...selected, employeeId] : selected.filter((id) => id !== employeeId),
    );
  };

  const selectedVisibleEmployeesCount = employees.filter((employee) =>
    selectedEmployees.includes(employee.id),
  ).length;

  const allEmployeesSelected =
    employees.length > 0 && selectedVisibleEmployeesCount === employees.length;

  const someEmployeesSelected = selectedVisibleEmployeesCount > 0 && !allEmployeesSelected;

  return {
    activeArchive,
    setActiveArchive,

    selectedEmployees,
    setSelectedEmployees,

    skillsModalEmployee,
    setSkillsModalEmployee,

    toggleAllSelected,
    allEmployeesSelected,

    toggleEmployeeSelected,
    someEmployeesSelected,
  };
};
