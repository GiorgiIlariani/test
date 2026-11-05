'use client';

import { IncomeStatement } from 'types';
import { Props } from './types';
import { objectKeys } from 'helpers';

export const useIncomeStatementEmployeeRow = (
  income: IncomeStatement[],
  costOfBenchNest: Props['costOfBenchNest'],
  sortingState: Props['sortingState'],
) => {
  const employeeData = (otherThanProject: Props['otherThanProject']) => {
    const currentSortingMonth = sortingState?.find((item) => item.current)?.index ?? 0;

    const employees = !!costOfBenchNest
      ? (income[currentSortingMonth]['other_than_project_cogs'][
          otherThanProject as 'cost_of_bench'
        ][costOfBenchNest].employees as {
          [key: string]: {
            id: number;
            first_name: string;
            last_name: string;
            total: number;
          };
        })
      : (income[currentSortingMonth]['other_than_project_cogs'][
          otherThanProject as 'cost_of_released'
        ].employees as {
          [key: string]: {
            id: number;
            first_name: string;
            last_name: string;
            total: number;
          };
        });

    let employeeKeys = !!costOfBenchNest
      ? income[currentSortingMonth]['other_than_project_cogs'][otherThanProject as 'cost_of_bench'][
          costOfBenchNest
        ].employeesKeys
      : income[currentSortingMonth]['other_than_project_cogs'][
          otherThanProject as 'cost_of_released'
        ].employeesKeys;

    if (!employeeKeys) {
      employeeKeys = objectKeys(employees) as string[];
    }

    return { employees, employeeKeys };
  };

  return { employeeData };
};
