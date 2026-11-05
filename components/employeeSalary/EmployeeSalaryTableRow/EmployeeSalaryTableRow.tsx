import React from 'react';
import Link from 'next/link';
import { FULL_MONTH_NAMES } from 'config';
import { can, convertNumbersAsPrice } from 'helpers';
import { EmployeeSalaryTableCellTooltip, NewTab } from 'components';
import { Props } from './Props';
import { useEmployeeSalaryTableRow } from './useEmployeeSalaryTableRow';

const EmployeeSalaryTableRow: React.FC<Props> = ({
  employee,
  permissions,
  currency,
  onCellClick,
  year,
}) => {
  const {
    hoveredCell,
    getEmployeeCareerLogs,
    getDraftLogColor,
    referenceElement,
    handleMouseEnter,
    handleMouseLeave,
  } = useEmployeeSalaryTableRow();

  return (
    <div className='h-14 flex justify-between w-max min-w-full border-b last:border-b-0'>
      <div className='grid grid-cols-[13rem_13rem] items-center justify-between bg-white sticky top-0 left-0 z-10 shrink-0 text-xs'>
        <div className='flex items-center justify-between gap-2 pl-8 h-full border-r'>
          <p>
            {employee.first_name} {employee.last_name}
          </p>
          {can('employee::list', permissions) && (
            <Link
              className='hover:opacity-40 mr-6'
              target='_blank'
              href={`/employee/${employee.id}/information`}
            >
              <NewTab size='20' />
            </Link>
          )}
        </div>
        <div className='flex items-center px-8 h-full border-r'>{employee.position?.title}</div>
      </div>

      <div
        className='grid'
        style={{ gridTemplateColumns: `repeat(${FULL_MONTH_NAMES.length + 1}, 9.5rem)` }}
      >
        {FULL_MONTH_NAMES.map((monthName, idx) => {
          const monthKey = `${year}-${String(idx + 1).padStart(2, '0')}`;
          const amount = employee.monthly?.[monthKey]?.[currency] ?? 0;

          const logs = getEmployeeCareerLogs(employee, monthKey);
          const draftLogColor = getDraftLogColor(employee, monthKey);
          const employeeMonthCell = `${employee.id}-${monthKey}`;

          return (
            <div
              key={monthKey}
              className={
                'px-6 border-r relative hover:cursor-pointer flex items-center justify-between'
              }
              onClick={() =>
                onCellClick({
                  employee_id: employee.id,
                  month: monthKey,
                })
              }
              onMouseEnter={(e) => handleMouseEnter(e, employeeMonthCell)}
              onMouseLeave={handleMouseLeave}
            >
              <span
                className={
                  draftLogColor ||
                  (employee.monthly?.[monthKey]?.is_salary_draft ? 'text-zinc-400' : '')
                }
                style={
                  logs && logs.length > 0
                    ? {
                        textDecoration: 'underline',
                        textDecorationColor: '#22c55e',
                        textDecorationStyle: 'dotted',
                        textUnderlineOffset: '3px',
                      }
                    : {}
                }
              >
                {convertNumbersAsPrice(amount)}
              </span>

              {hoveredCell === employeeMonthCell && logs && logs.length > 0 && (
                <EmployeeSalaryTableCellTooltip
                  logs={logs}
                  month={monthName}
                  year={year}
                  employeeName={`${employee.first_name} ${employee.last_name}`}
                  referenceElement={referenceElement}
                  draftLogColor={draftLogColor}
                />
              )}
            </div>
          );
        })}

        <div className='px-6 py-2 border-r flex items-center'>
          {convertNumbersAsPrice(employee.yearly_total?.[currency] ?? 0)}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryTableRow;
