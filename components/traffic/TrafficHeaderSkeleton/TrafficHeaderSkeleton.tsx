import React from 'react';
import { Props } from './types';

const TrafficHeaderSkeleton: React.FC<Props> = (props) => {
  return (
    <>
      <section className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6 w-[14%]'>
        <h3 className='text-sm'>{props.headerTitles[0]['title']}</h3>
        <div className='w-[70%] h-9 bg-gray-300 animate-pulse rounded-md' />
      </section>
      <section className='flex gap-6 border-r border-gray-100 px-6 py-6 w-[43%]'>
        <div className='flex flex-col gap-2 w-[29%]'>
          <div className='flex gap-2'>
            <h3 className='text-sm'> {props.headerTitles[1]['title']} </h3>
            <div className='w-8 h-5 bg-gray-300 animate-pulse rounded-md' />
          </div>
          <div className='w-[80%] h-9 bg-gray-300 animate-pulse rounded-md' />
        </div>
        <div className='flex flex-col gap-2 w-[69%]'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-[#0D9488] rounded-full' />
              <h3>{props.headerTitles[2]['title']}</h3>
            </div>

            <div className='flex gap-3'>
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-[#0284C7] rounded-full' />
              <h3>{props.headerTitles[3]['title']}</h3>
            </div>

            <div className='flex gap-3'>
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
            </div>
          </div>
        </div>
      </section>
      {!!!props.swapLastAndPreviousWidget && (
        <section className='w-[14%]'>
          <div className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6'>
            <div className='flex gap-2'>
              <h3 className='text-sm'> {props.headerTitles[4]['title']} </h3>
              <div className='w-8 h-5 bg-gray-300 animate-pulse rounded-md' />
            </div>
            <div className='w-[80%] h-9 bg-gray-300 animate-pulse rounded-md' />
          </div>
        </section>
      )}
      <section className='flex gap-2 border-r border-gray-100 px-6 py-6 w-[36%]'>
        <div className='flex flex-col gap-2 w-[29%]'>
          <h3 className='text-sm'>{props.headerTitles[5]['title']} </h3>
          <div className='w-[80%] h-9 bg-gray-300 animate-pulse rounded-md' />
        </div>
        <div className='flex flex-col gap-2 w-[69%]'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-[#0D9488] rounded-full' />
              <h3>{props.headerTitles[6]['title']}</h3>
            </div>

            <div className='flex gap-4'>
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-[#0284C7] rounded-full' />
              <h3>{props.headerTitles[7]['title']}</h3>
            </div>

            <div className='flex gap-4'>
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
              <div className='w-12 h-6 bg-gray-300 animate-pulse rounded-md' />
            </div>
          </div>
        </div>
      </section>
      {!!props.swapLastAndPreviousWidget && (
        <section className='w-[14%]'>
          <div className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6'>
            <div className='flex gap-2'>
              <h3 className='text-sm'> {props.headerTitles[4]['title']} </h3>
              <div className='w-8 h-5 bg-gray-300 animate-pulse rounded-md' />
            </div>
            <div className='w-[80%] h-9 bg-gray-300 animate-pulse rounded-md' />
          </div>
        </section>
      )}
    </>
  );
};

export default TrafficHeaderSkeleton;
