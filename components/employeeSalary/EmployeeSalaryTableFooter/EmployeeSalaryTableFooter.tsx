import React from 'react';
import { FULL_MONTH_NAMES } from 'config';
import { convertNumbersAsPrice } from 'helpers';
import { Props } from './Props';

const EmployeeSalaryTableFooter: React.FC<Props> = ({ loading, employees, year, currency }) => {
  return (
    <div className='sticky bottom-0 z-20 h-14 flex justify-between border-t w-max min-w-full text-xs font-semibold bg-indigo-50 text-indigo-900'>
      <div className='grid grid-cols-[13rem_13rem] items-center justify-between sticky bottom-0 left-0 z-30 shrink-0 bg-indigo-50 text-indigo-900 font-bold'>
        <div className='h-full flex gap-1 items-center cursor-pointer border-r px-8'>
          Count:{' '}
          {loading ? (
            <div className='h-4 w-10 bg-gray-300 rounded-sm animate-pulse'></div>
          ) : (
            <p>{employees.length}</p>
          )}
        </div>
        <div className='h-full flex items-center border-r px-8'>Total:</div>
      </div>

      <div
        className='grid'
        style={{ gridTemplateColumns: `repeat(${FULL_MONTH_NAMES.length + 1}, 9.5rem)` }}
      >
        {FULL_MONTH_NAMES.map((_, idx) => {
          const monthKey = `${year}-${String(idx + 1).padStart(2, '0')}`;
          const total = employees.reduce(
            (sum, emp) => sum + (emp.monthly?.[monthKey]?.[currency] ?? 0),
            0,
          );
          return (
            <div
              key={monthKey}
              className='px-6 border-r bg-indigo-50 flex items-center justify-between'
            >
              {loading ? (
                <div className='h-4 w-full bg-gray-300 rounded-sm animate-pulse'></div>
              ) : (
                convertNumbersAsPrice(total)
              )}
            </div>
          );
        })}

        <div className='px-6 bg-indigo-50 flex items-center justify-between border-r'>
          {loading ? (
            <div className='h-4 w-full bg-gray-300 rounded-sm animate-pulse'></div>
          ) : (
            convertNumbersAsPrice(
              employees.reduce((sum, emp) => sum + (emp.yearly_total?.[currency] ?? 0), 0),
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryTableFooter;
