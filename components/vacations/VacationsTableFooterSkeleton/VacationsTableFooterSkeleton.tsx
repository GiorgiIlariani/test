import React from 'react';

const VacationsTableFooterSkeleton: React.FC<{}> = () => {
  return (
    <div
      className='sticky bottom-0 left-0 z-30 h-6 bg-white w-max min-w-full text-xs text-gray-400
                 hidden md:flex'
    >
      <div className='w-62 bg-white z-10 sticky left-0' />
      <div className='w-54 bg-white z-10' />

      <div className='w-44 bg-white z-10 sticky left-62 px-5 flex items-center justify-end font-semibold'>
        <div className='h-2 w-4 rounded-full bg-gray-300 animate-pulse' />
      </div>

      <div className='w-34 bg-white px-5 flex items-center justify-end font-semibold'>
        <div className='h-2 w-4 rounded-full bg-gray-300 animate-pulse' />
      </div>

      <div className='flex'>
        {Array.from({ length: 12 }).map((v, i) => (
          <div key={i} className='w-[6.5rem] flex items-center justify-center'>
            <div className='h-2 w-14 rounded-full bg-gray-300 animate-pulse' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationsTableFooterSkeleton;
