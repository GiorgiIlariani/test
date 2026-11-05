import React from 'react';

const SkeletonLoader: React.FC<{ showToggle: boolean; quantity?: number }> = (props) => {
  return (
    <ul>
      {Array.from({ length: props?.quantity ? props?.quantity : 3 }, (_, i) => i + 1).map((item) =>
        props.showToggle ? (
          <li key={item} className='grid grid-cols-2 gap-4 pl-3'>
            <div className='col-span-1 w-[80%]'>
              <div className='mt-1 w-full  h-14 animate-pulse rounded-md bg-gray-300' />
            </div>
            <div className='col-span-1 w-[80%]'>
              <div className='mt-1 w-full  h-14 animate-pulse rounded-md bg-gray-300' />
            </div>
          </li>
        ) : (
          <li key={item} className='pl-3'>
            <div className='mt-1 w-full h-14 animate-pulse rounded-md bg-gray-300' />
          </li>
        ),
      )}
    </ul>
  );
};

export default SkeletonLoader;
