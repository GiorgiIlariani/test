import React from 'react';
import { Props } from './Props';
import { INCOME_HEADERS } from 'config';
import { twMerge } from 'tailwind-merge';

const EmployeeSalaryTableHeader: React.FC<Props> = ({ sortingState, sortEmployeeSalary }) => {
  return (
    <div className='sticky top-0 z-20 h-14 flex justify-between border-b w-max min-w-full bg-indigo-50'>
      <div className='grid grid-cols-[13rem_13rem] items-center justify-between sticky top-0 left-0 z-30 shrink-0 bg-indigo-50 text-indigo-900 text-xs font-medium'>
        <div className='h-full flex items-center border-r px-8'>Employee</div>
        <div className='h-full flex items-center border-r px-8'>Position</div>
      </div>

      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(${INCOME_HEADERS.length}, 9.5rem)`,
        }}
      >
        {INCOME_HEADERS.map((el, i) => (
          <div
            key={el}
            className={twMerge(
              'flex items-center pl-6 text-xs text-indigo-900 font-medium cursor-pointer border-r',
              sortingState[i]?.sortedBy === 'desc' && sortingState[i]?.current ? 'font-bold!' : '',
            )}
            onClick={() => sortEmployeeSalary(i)}
          >
            {el}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSalaryTableHeader;
