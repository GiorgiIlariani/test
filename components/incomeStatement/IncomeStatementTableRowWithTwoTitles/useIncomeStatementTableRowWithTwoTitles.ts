'use client';

import { objectKeys } from 'helpers';
import { IncomeStatement } from 'types';

export const useIncomeStatementTableRowWithTwoTitles = (income: IncomeStatement[]) => {
  const employeeData = (department: number) => {
    const employees = income?.map(
      (item) => item.total_admin_costs.admin_salaries.departments[department]?.employees,
    );

    const uniqueEmployees = Object.assign({}, ...employees) as {
      [key: string]: {
        id: number;
        first_name: string;
        last_name: string;
        total: number;
      };
    };

    const employeeKeys = objectKeys(employees);
    return { uniqueEmployees, employeeKeys };
  };

  return { employeeData };
};
