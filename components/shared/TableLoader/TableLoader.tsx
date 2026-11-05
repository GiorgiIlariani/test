import { DownChevron } from 'components';
import React from 'react';

const TableLoader = ({ cols, rows }: { rows?: number; cols?: number }) => {
  return (
    <div className='w-full px-6 py-6'>
      <div className='flex items-center gap-2 pb-4 text-slate-900 font-medium'>
        <DownChevron />
        <div className='text-gray-300 bg-gray-300 h-4 w-36 rounded-md animate-pulse select-none' />
      </div>

      <div className={`w-360  rounded-md border`}>
        <table className='w-full border pb-36'>
          <thead className='sticky -top-[2px]'>
            <tr className='border-b border-gray-600 pt-4 bg-indigo-50 tracking-wide text-indigo-900 text-xs'>
              {Array.from(Array(cols ?? 10).keys())?.map((tableHead) => {
                return (
                  <th className='border pl-6 py-2 px-2 text-left' key={tableHead}>
                    <div className='text-gray-300 bg-gray-300 h-4 rounded-md animate-pulse select-none' />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className='border-zinc-200 border'>
            {Array.from(Array(rows ?? 5).keys()).map((item) => (
              <tr key={item} className={`cursor-pointer border border-zinc-200  tracking-wide`}>
                {Array.from(Array(cols ?? 10).keys())?.map((tableHead) => {
                  return (
                    <th className='border pl-6 py-2 px-2 text-left' key={tableHead}>
                      <div className='bg-gray-300 animate-pulse border-gray-100 h-4 rounded-md' />
                    </th>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLoader;
