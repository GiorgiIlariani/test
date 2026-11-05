import React from 'react';
import { Props } from './Props';

const ClientRetentionTableSkeleton: React.FC<Props> = ({
  rows = 20,
  cols = 4,
  colWidth = '10rem',
}) => {
  return (
    <div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className='h-14 flex justify-between border-b w-max min-w-full animate-pulse'
        >
          <div className='grid grid-cols-[10rem_8rem] items-center justify-between bg-white sticky top-0 left-0 z-30 shrink-0 text-xs'>
            <div className='pl-10'>
              <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
            </div>
            <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
          </div>

          <div className='grid' style={{ gridTemplateColumns: `repeat(${cols}, ${colWidth})` }}>
            {Array.from({ length: cols }).map((__, colIdx) => (
              <div key={colIdx} className='flex items-center justify-center'>
                <div className='h-4 bg-gray-200 rounded-sm w-2/3'></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientRetentionTableSkeleton;
