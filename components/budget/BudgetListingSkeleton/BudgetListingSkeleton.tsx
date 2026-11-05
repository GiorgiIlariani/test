import React from 'react';

const BudgetListingSkeleton: React.FC<{ isProject?: boolean }> = (props) => {
  return (
    <div className='w-full xl:w-[67%] h-full'>
      <div className={`${props.isProject ? '' : '-mt-12'} `}>
        <div className={`${props.isProject ? 'pb-3' : 'pb-6'} flex gap-3 items-center `}>
          <div className='w-32 h-6 bg-gray-300 animate-pulse rounded-md'></div>
          <div className='w-24 h-4 bg-gray-300 animate-pulse rounded-md'></div>
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <section
            key={i}
            className='grid grid-rows-[1fr] transition-all duration-300 ease-out pt-3'
          >
            <div className='group bg-white border border-zinc-200 rounded-md p-4 w-full transition-all duration-300 relative h-[3.625rem] flex flex-col items-start'>
              <div className='flex items-center justify-between -mt-2 w-full'>
                <div className='w-full flex items-center justify-between'>
                  <div className='flex items-center justify-between w-[50%] mr-12'>
                    <div className='w-[65%] h-8 bg-gray-300 animate-pulse rounded-md'></div>
                    <div className='w-16 h-6 bg-gray-300 animate-pulse rounded-md'></div>
                  </div>
                  <div className='flex items-center w-full gap-5'>
                    <div className='w-[20%] h-8 bg-gray-300 animate-pulse rounded-md'></div>
                    <div className='flex flex-col items-start text-xs w-16 h-6 bg-gray-300 animate-pulse rounded-md'></div>
                  </div>
                </div>
                <div className='w-6 h-6 bg-gray-300 animate-pulse rounded-full'></div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BudgetListingSkeleton;
