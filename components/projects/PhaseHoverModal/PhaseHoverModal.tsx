import { getFormattedDate } from 'helpers';
import { Props } from './types';
import React from 'react';

const PhaseHoverModal: React.FC<Props> = (props) => {
  return (
    <div className='w-108 h-[14.063rem] rounded-md bg-white border border-zinc-200 p-[1.125rem] text-slate-900 absolute top-10 left-0 z-50 overflow-y-scroll'>
      <h4 className='font-medium pb-2'>Phases</h4>
      <ul className='flex flex-col gap-[1.125rem]'>
        {props.terms?.map((term) => (
          <li key={term.id} className='w-full flex flex-col gap-2'>
            <div className='flex items-center justify-between w-full'>
              <p className='text-sm text-font-medium'>{term.name}</p>
              <p className='text-[#5A636F] uppercase text-xs bg-[#F3F4F6] rounded-[1px] px-1 py-[2px]'>
                {term?.budget?.title ? term?.budget?.title : 'Untitled'}
              </p>
            </div>
            <div className='w-full bg-indigo-50 rounded-full h-2.5'>
              <div
                className='bg-indigo-600 h-2.5 rounded-full'
                style={{
                  width: `${
                    term?.work_days ? Math.round((term?.passed_days! / term?.work_days) * 100) : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className='flex items-center gap-[0.438rem]'>
              <p className='text-xs text-[#5A636F]'>{term?.work_days} W/D</p>
              <p className='text-xs text-slate-900'>
                {getFormattedDate(term?.start_date, true, true)} -{' '}
                {getFormattedDate(term?.end_date, true, true)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhaseHoverModal;
