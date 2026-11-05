import React from 'react';
import { Props } from './Props';

const VacationsTableHeader: React.FC<Props> = ({ monthNames, colWidth = '6.5rem' }) => {
  return (
    <div
      className='sticky top-0 z-30 h-14 border-b-[0.5px] w-max min-w-full bg-indigo-50 text-xs text-indigo-900 font-medium
                 hidden md:flex'
    >
      <div className='flex items-center w-62 h-full px-5 border-r sticky top-0 left-0 bg-indigo-50 z-30 shrink-0'>
        Employee
      </div>
      <div className='flex items-center w-54 h-full px-5 border-r'>Current Projects</div>
      <div className='flex items-center w-44 h-full px-5 border-r justify-end sticky top-0 left-62 bg-indigo-50 z-30 shrink-0'>
        Vacation Days Used
      </div>
      <div className='flex items-center w-34 h-full px-5 border-r justify-end'>Sick Days Used</div>

      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(${monthNames.length}, ${colWidth})`,
        }}
      >
        {monthNames.map((el) => (
          <div key={el} className='flex items-center capitalize pl-5 border-r'>
            {el}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationsTableHeader;
