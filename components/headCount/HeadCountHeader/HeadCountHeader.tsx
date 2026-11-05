import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Props } from './Props';
import { useHeadCountHeader } from './useHeadCountHeader';

const HeadCountHeader: React.FC<Props> = ({ totals, isLoading }) => {
  const {
    resources,
    newHires,
    terminationsTotal,
    voluntaryTerminations,
    involuntaryTerminations,
    annualGrowth,
    formattedTurnover,
    formattedGrowth,
    renderValue,
  } = useHeadCountHeader(totals, isLoading);

  return (
    <div className='flex bg-white border border-gray-100 rounded-md mb-3 w-full shadow-xs'>
      <section className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6 w-[20%]'>
        <h3 className='text-sm text-zinc-600'>Resources</h3>
        <p className='text-2xl font-bold truncate'>{renderValue(resources)}</p>
      </section>

      <section className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6 w-[20%]'>
        <h3 className='text-sm text-zinc-600'>New hires</h3>
        <p className='text-2xl font-bold truncate'>{renderValue(newHires)}</p>
      </section>

      <section className='flex xl:gap-8 gap-4 border-r border-gray-100 px-6 py-6 w-[25%]'>
        <div>
          <h3 className='text-sm text-zinc-600'>Terminations</h3>
          <p className='text-2xl font-bold truncate'>{renderValue(terminationsTotal)}</p>
        </div>

        <div className='text-sm text-zinc-400'>
          <div className='flex gap-2 items-center'>
            <div className='w-3 h-3 bg-[#0D9488] rounded-full' />
            <p>
              {isLoading ? (
                <div className='h-4 w-16 bg-gray-200 rounded-sm animate-pulse' />
              ) : (
                `Voluntary: ${voluntaryTerminations}`
              )}
            </p>
          </div>

          <div className='flex gap-2 items-center'>
            <div className='w-3 h-3 bg-[#0D9488] rounded-full' />
            <p>
              {isLoading ? (
                <div className='h-4 w-16 bg-gray-200 rounded-sm animate-pulse' />
              ) : (
                `Involuntary: ${involuntaryTerminations}`
              )}
            </p>
          </div>
        </div>
      </section>

      <section className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6 w-[20%]'>
        <h3 className='text-sm text-zinc-600'>Turnover rate</h3>
        <p className='text-2xl font-bold truncate'>{renderValue(formattedTurnover + '%')}</p>
      </section>

      <section className='flex flex-col gap-2 px-6 py-6 w-[15%]'>
        <h3 className='text-sm text-zinc-600'>Annual growth</h3>
        <p
          className={twMerge(
            'text-2xl font-bold truncate',
            annualGrowth > 0 && 'text-success',
            annualGrowth < 0 && 'text-red-600',
          )}
        >
          {isLoading ? (
            <div className='h-6 w-16 bg-gray-200 rounded-sm animate-pulse' />
          ) : (
            formattedGrowth + '%'
          )}
        </p>
      </section>
    </div>
  );
};

export default HeadCountHeader;
