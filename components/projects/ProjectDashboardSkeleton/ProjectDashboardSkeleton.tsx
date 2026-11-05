import React from 'react';

const ProjectDashboardSkeleton: React.FC = () => {
  return (
    <ul className='flex flex-col gap-2 py-2'>
      {Array.from({ length: 8 }).map((_, index) => (
        <li
          className='grid grid-cols-14 py-3 border border-gray-100 rounded-md bg-white animate-pulse'
          key={index}
        >
          <div className='col-span-3 border-r border-gray-100 pl-3 flex items-center h-[2.688rem]'>
            <div className='flex items-center gap-2.5 pl-6'>
              <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
              <div className='w-24 h-4 bg-gray-300 rounded-md'></div>
            </div>
          </div>

          <div className='col-span-2 border-r border-gray-100 pl-3 flex items-center h-[2.688rem]'>
            <div className='w-28 h-4 bg-gray-300 rounded-md'></div>
          </div>

          <div className='col-span-1 border-r border-gray-100 flex items-center justify-center h-[2.688rem]'>
            <div className='w-16 h-6 bg-gray-300 rounded-[19px]'></div>
          </div>

          <div className='col-span-3 border-r border-gray-100 pl-3 h-[2.688rem] flex items-center'>
            <ul className='flex items-center gap-1.5'>
              <div className='w-16 h-6 bg-gray-300 rounded-[19px]'></div>
              <div className='w-16 h-6 bg-gray-300 rounded-[19px]'></div>
            </ul>
          </div>

          <div className='col-span-3 border-r border-gray-100 px-3 flex items-center justify-center h-[2.688rem]'>
            <div className='w-full bg-gray-300 rounded-full h-2.5'>
              <div className='bg-gray-400 h-2.5 rounded-full' style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className='col-span-2 border-r border-gray-100 px-3 h-[2.688rem] flex items-center'>
            <div className='flex gap-1.5 items-center'>
              <div className='w-4 h-4 bg-gray-300 rounded-full'></div>
              <div className='w-24 h-4 bg-gray-300 rounded-md'></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectDashboardSkeleton;
