import React from 'react';

const VacationsTableSkeleton: React.FC<{ monthNames: string[] }> = ({ monthNames }) => {
  return Array.from({ length: 20 }).map((_, index) => (
    <div
      key={index}
      className='flex flex-col border border-slate-100 rounded-3xl p-4 shadow-4xl bg-white
                 md:w-max md:min-w-full md:h-20 md:flex-row md:border-none md:rounded-none md:p-0 md:shadow-none'
    >
      <div
        className='flex justify-between mb-4 
                   md:contents'
      >
        <div
          className='flex items-center gap-2 bg-white
                     md:w-62 md:border-r md:border-b md:px-5 md:sticky md:left-0 md:z-10'
        >
          <div
            className='size-12 rounded-full bg-gray-300 object-cover animate-pulse
                       md:size-8'
          />

          <div className='flex flex-col gap-1'>
            <div className='h-4 w-28 rounded-full bg-gray-300 animate-pulse' />
            <div className='h-3 w-16 rounded-full bg-gray-200 animate-pulse' />
            <div
              className='h-3 w-10 rounded-full bg-gray-200 animate-pulse 
                         md:hidden'
            />
          </div>
        </div>

        <div
          className='hidden w-54 items-center relative
                     md:flex md:border-r md:border-b md:px-5'
        >
          <div className='h-4 w-full rounded-full bg-gray-300 animate-pulse' />
        </div>

        <div
          className='flex items-end justify-center flex-col gap-1 bg-white shrink-0
                     md:w-44 md:border-r md:border-b md:px-5 md:sticky md:left-62 md:z-10'
        >
          <div className='flex items-center gap-1.5'>
            <div className='h-4 w-6 rounded-full bg-gray-300 animate-pulse' />
            <div
              className='h-4 w-6 rounded-full bg-gray-300 animate-pulse 
                         md:hidden'
            />
          </div>

          <div
            className='h-3 w-20 rounded-full bg-gray-200 animate-pulse
                       md:w-22'
          />
        </div>

        <div
          className='w-34 px-5 items-center justify-end border-r border-b hidden 
                     md:flex'
        >
          <div className='h-4 w-8 rounded-full bg-gray-300 animate-pulse' />
        </div>
      </div>

      <div
        className='flex justify-between gap-2 overflow-x-auto no-scrollbar
                   md:grid md:gap-0 md:overflow-visible'
        style={{ gridTemplateColumns: `repeat(${monthNames.length}, 6.5rem)` }}
      >
        {monthNames.map((_, index) => (
          <div
            key={index}
            className='flex items-center content-center gap-1 flex-col
                       md:flex-row md:flex-wrap md:justify-center md:border-r md:border-b'
          >
            <div
              className='bg-gray-300 animate-pulse rounded-full size-10 shrink-0 flex items-center justify-center 
                         md:hidden'
            />
          </div>
        ))}
      </div>
    </div>
  ));
};

export default VacationsTableSkeleton;
