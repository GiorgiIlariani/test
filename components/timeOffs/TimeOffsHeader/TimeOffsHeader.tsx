import { Props } from './Props';
import React from 'react';
import { YearsDropDown, TimeOffsHeaderActionButtons, Plus } from 'components';

const TimeOffsHeader: React.FC<Props> = ({
  selectYearHandler,
  currentYear,
  getExcelHandler,
  excelButtonIsLoading,
  sumOfAllReviewableVacations,
  openReviewAllModal,
  toggleAdding,
  isLoading,
  permissions,
}) => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1
            className='text-2xl font-bold text-gray-900 hidden 
                       md:block'
          >
            Time offs
          </h1>

          <YearsDropDown
            selectYearHandler={selectYearHandler}
            currentYear={currentYear}
            page='Time offs'
          />
        </div>

        <div className='flex items-center gap-4 md:gap-6'>
          <TimeOffsHeaderActionButtons
            getExcelHandler={getExcelHandler}
            excelButtonIsLoading={excelButtonIsLoading}
            sumOfAllReviewableVacations={sumOfAllReviewableVacations}
            openReviewAllModal={openReviewAllModal}
            isLoading={isLoading}
            permissions={permissions}
          />

          <button
            onClick={toggleAdding}
            disabled={isLoading}
            className='transition-150-ease-in z-10 disabled:opacity-20 cur flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-2xl font-black text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 shadow-lg shadow-indigo-600/30 active:scale-95 md:shadow-none'
          >
            <Plus />
          </button>
        </div>
      </div>

      <h1
        className='text-3xl font-bold text-gray-900 block my-4
                   md:hidden'
      >
        Time offs
      </h1>
    </div>
  );
};

export default TimeOffsHeader;
