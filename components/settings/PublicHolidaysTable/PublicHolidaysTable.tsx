import { Props } from './types';
import React from 'react';
import { formatDate } from 'helpers';

const PublicHolidaysTable: React.FC<Props> = (props) => {
  return (
    <div>
      <div className='max-w-full w-full flex grow'>
        <div className='w-full xl:w-[60%] overflow-clip rounded-md  mt-4 '>
          <div className='grid grid-flow-row grid-cols-10  border border-[#F3F4F6]! bg-indigo-50 text-xs tracking-wide text-indigo-900'>
            <div className='col-span-1 border-r py-[15px]  text-center font-medium '>#</div>
            <div className='col-span-7 border-r py-[15px] pl-6 text-left font-medium'>Holiday</div>
            <div className='col-span-2 truncate border-r py-[15px] pl-6 text-left font-medium'>
              Date
            </div>
          </div>
          <ul className='h-150 overflow-auto mb-10'>
            {props.isLoading
              ? Array.from(Array(10).keys()).map((item) => (
                  <li
                    key={item}
                    className=' grid-flow-row grid-cols-10 border border-[#F3F4F6] grid  tracking-wide text-zinc-700'
                  >
                    <div className='col-span-1 border-r py-6 flex items-center justify-center'>
                      <div className='w-8 h-6 animate-pulse rounded-md bg-gray-300'></div>
                    </div>
                    <div className='col-span-7 border-r ml-6 py-6 flex items-center '>
                      <div className='w-48 h-6 animate-pulse rounded-md bg-gray-300' />
                    </div>
                    <div className='col-span-2 border-r ml-6 py-6 flex items-center '>
                      <div className='w-20 h-6 animate-pulse rounded-md bg-gray-300' />
                    </div>
                  </li>
                ))
              : props.holidays?.map((holiday, i) => (
                  <li
                    key={holiday.id}
                    className='grid grid-flow-row grid-cols-10 border border-[#F3F4F6]  tracking-wide text-zinc-700'
                  >
                    <div className='col-span-1 border-r py-[26px] text-center'>{i + 1}</div>
                    <div
                      className='col-span-7 border-r py-[26px] pl-6 text-left truncate '
                      title={holiday.holiday}
                    >
                      {holiday.holiday}
                    </div>
                    <div className='col-span-2 truncate border-r py-[26px] pl-6 text-left '>
                      {formatDate(holiday.date)}
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PublicHolidaysTable;
