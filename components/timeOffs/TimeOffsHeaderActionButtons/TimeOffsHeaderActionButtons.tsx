import { ActionButton } from 'components/invoices';
import { can } from 'helpers';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Props } from './Props';

const TimeOffsHeaderActionButtons: React.FC<Props> = ({
  getExcelHandler,
  excelButtonIsLoading,
  sumOfAllReviewableVacations,
  openReviewAllModal,
  isLoading,
  permissions,
}) => {
  return (
    <div className='flex items-center gap-4 relative'>
      <div className='flex items-center gap-4'>
        {can('vacation::download-excel', permissions) && (
          <button
            className='disabled:opacity-25 hidden md:block'
            onClick={getExcelHandler}
            disabled={isLoading}
          >
            <ActionButton
              buttonText={'Export Excel'}
              className={
                'h-11 px-5 rounded-md bg-white hover:bg-zinc-200 border border-zinc-300 text-zinc-700 flex items-center justify-center transition-colors'
              }
              icon={'csv'}
              isLoading={excelButtonIsLoading}
            />
          </button>
        )}

        <button
          disabled={isLoading || sumOfAllReviewableVacations === 0}
          onClick={() => {
            if (!isLoading && sumOfAllReviewableVacations > 0) {
              openReviewAllModal();
            }
          }}
          className={twMerge(
            'h-11 px-5 rounded-md bg-white hover:bg-zinc-200 border border-zinc-300 text-zinc-700 flex items-center justify-center gap-1 transition-colors font-medium text-sm',
            isLoading && 'cursor-default animate-pulse text-zinc-400',
            (isLoading || sumOfAllReviewableVacations === 0) && 'opacity-60',
          )}
        >
          Review All
          <span className='bg-zinc-100 text-xs size-6 rounded-full flex items-center justify-center p-1'>
            {isLoading ? '...' : sumOfAllReviewableVacations}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TimeOffsHeaderActionButtons;
