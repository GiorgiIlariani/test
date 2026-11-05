import React from 'react';
import { Props } from './types';
import { useVacationsTableFooter } from './useVacationsTableFooter';

const VacationsTableFooter: React.FC<Props> = (props) => {
  const { sumOfVacationsByMonth } = useVacationsTableFooter(props);

  return (
    <div
      className='sticky bottom-0 left-0 z-30 h-6 bg-white w-max min-w-full text-xs text-gray-400
                 hidden md:flex'
    >
      <div className='w-62 bg-white z-10 sticky left-0' />
      <div className='w-54 bg-white z-10' />

      <div className='w-44 bg-white z-10 sticky left-62 px-5 flex items-center justify-end font-semibold'>
        {props.sumOfVacationsTable.vacationDays}
      </div>

      <div className='w-34 bg-white px-5 flex items-center justify-end font-semibold'>
        {props.sumOfVacationsTable.sickDays}
      </div>

      <div className='flex'>
        {sumOfVacationsByMonth.map((v, i) => (
          <div key={i} className='w-[6.5rem] flex items-center justify-center'>
            V:{v.vacation} S:{v.sick_leave}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationsTableFooter;
