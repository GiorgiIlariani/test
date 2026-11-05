import React from 'react';
import { Props } from './Props';
import { twMerge } from 'tailwind-merge';

const ClientRetentionTableHeader: React.FC<Props> = ({
  labels,
  colWidth = '10rem',
  metric,
  sortDirection,
  onCohortClick,
}) => {
  return (
    <div className='sticky top-0 z-20 h-14 flex justify-between border-b-[0.5px] w-max min-w-full bg-indigo-50'>
      <div className='grid grid-cols-[10rem_8rem] items-center justify-between sticky top-0 left-0 z-30 shrink-0 bg-indigo-50 text-indigo-900 text-xs font-medium'>
        <div
          onClick={onCohortClick}
          className={twMerge(
            'h-full flex items-center cursor-pointer pl-10',
            sortDirection === 'asc' ? 'font-bold' : '',
          )}
        >
          Cohort
        </div>
        <div className='flex items-center h-full'>
          Total {metric === 'clients' ? 'Clients' : metric === 'projects' ? 'Projects' : 'Revenue'}
        </div>
      </div>

      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(${labels.length}, ${colWidth})`,
        }}
      >
        {labels.map((el) => (
          <div
            key={el}
            className='flex justify-center items-center text-xs text-indigo-900 font-medium cursor-pointer'
          >
            {el}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientRetentionTableHeader;
