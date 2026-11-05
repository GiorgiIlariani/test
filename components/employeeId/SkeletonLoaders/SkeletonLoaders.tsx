import React from 'react';
import { Props } from './types';

const SkeletonLoaders: React.FC<Props> = (props) => {
  return (
    <>
      {props.type === 'Other' && (
        <div className='flex flex-col gap-4 items-left w-full'>
          <div className='grid grid-cols-2 gap-4 animate-pulse'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />
              <div className='h-11 rounded-md bg-gray-300' />
            </div>

            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />
              <div className=' h-11 rounded-md bg-gray-300' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 animate-pulse rounded-md bg-gray-300' />
              <div className='h-11 animate-pulse rounded-md bg-gray-300' />
            </div>
          </div>
        </div>
      )}

      {props.type === 'Salary' && (
        <div className='flex flex-col gap-4 w-full'>
          <div className='grid grid-cols-2 gap-4 animate-pulse'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />
              <div className='h-11 rounded-md bg-gray-300' />
            </div>

            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />
              <div className=' h-11 rounded-md bg-gray-300' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 animate-pulse rounded-md bg-gray-300' />
              <div className='h-11 animate-pulse rounded-md bg-gray-300' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 animate-pulse rounded-md bg-gray-300' />
              <div className='h-11 animate-pulse rounded-md bg-gray-300' />
            </div>
          </div>

          <div className='flex flex-col h-full'>
            <div className='w-28 h-5.5 mb-1 animate-pulse rounded-md bg-gray-300' />
            <div className='w-full h-8 animate-pulse rounded-md bg-gray-300' />
          </div>
        </div>
      )}

      {props.type === 'Termination' && (
        <div className='flex flex-col gap-4 w-full animate-pulse'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />
              <div className='h-11 rounded-md bg-gray-300' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />
              <div className='h-11 rounded-md bg-gray-300' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />

              <div className='flex gap-2'>
                <div className='w-24 h-8 rounded-md bg-gray-300' />
                <div className='w-24 h-8 rounded-md bg-gray-300' />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />
              <div className='h-11 rounded-md bg-gray-300' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='w-28 h-5.5 mb-1 rounded-md bg-gray-300' />

              <div className='flex gap-2'>
                <div className='w-12 h-8 rounded-md bg-gray-300' />
                <div className='w-12 h-8 rounded-md bg-gray-300' />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkeletonLoaders;
