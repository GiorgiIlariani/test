'use client';

import { Props } from './types';
import React from 'react';
import { useRouter } from 'next/router';

const WelcomeCard: React.FC<Props> = (props) => {
  const { push } = useRouter();
  return (
    <div
      onClick={() => {
        push(props.link);
      }}
      className='border border-gray-100 cursor-pointer hover:drop-shadow-md transition-all duration-200 group rounded-xl flex flex-col overflow-hidden h-100 bg-white'
    >
      <div className='bg-zinc-700 rounded-t-xl h-48 overflow-hidden relative flex items-center justify-center'>
        <img
          src={props.image?.src}
          alt='employee profile'
          className={`size-full absolute object-contain group-hover:scale-110 ${props.imageClasses}  transition-all `}
        />
      </div>

      <div className='p-6 flex grow flex-col justify-between'>
        <div className='h-full'>
          <div className='relative flex items-center justify-between'>
            <h1 className='text-slate-900 font-bold text-xl capitalize'>{props.header}</h1>

            {props.extraVioletText && (
              <div className='py-1 px-2  flex items-center justify-center bg-indigo-500 rounded-3xl'>
                <span className='block  text-xs text-white font-medium'>
                  {props.extraVioletText}
                </span>
              </div>
            )}
          </div>

          <p className='text-zinc-700 whitespace-pre-wrap mt-2 text-sm'>{props.body}</p>
        </div>

        <span className='text-indigo-600  mt-auto block text-right'>Check out</span>
      </div>
    </div>
  );
};

export default WelcomeCard;
