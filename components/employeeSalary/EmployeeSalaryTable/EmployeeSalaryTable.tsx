import React from 'react';
import { Props } from './Props';
import {
  EmployeeSalaryTableFooter,
  EmployeeSalaryTableHeader,
  EmployeeSalaryTableRow,
  EmployeeSalaryTableSkeleton,
} from 'components';

const EmployeeSalaryTable: React.FC<Props> = ({
  year,
  employees,
  currency,
  loading,
  sortingState,
  sortEmployeeSalary,
  permissions,
  onCellClick,
}) => {
  return (
    <div className='rounded-md overflow-hidden border'>
      <div className='overflow-auto h-full'>
        <EmployeeSalaryTableHeader
          sortingState={sortingState}
          sortEmployeeSalary={sortEmployeeSalary}
        />

        <div>
          {loading ? (
            <EmployeeSalaryTableSkeleton />
          ) : (
            employees.map((employee) => (
              <EmployeeSalaryTableRow
                key={employee.id}
                employee={employee}
                permissions={permissions}
                currency={currency}
                onCellClick={onCellClick}
                year={year}
              />
            ))
          )}
        </div>

        <EmployeeSalaryTableFooter
          loading={loading}
          employees={employees}
          year={year}
          currency={currency}
        />
      </div>
    </div>
  );
};

export default EmployeeSalaryTable;
