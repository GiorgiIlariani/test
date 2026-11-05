import { Props } from './types';
import React from 'react';
import { useTrackerDateSection } from './useTrackerDateSection';
import { ArrowLeft, BlueExclamationCircle } from 'components/icons';
import { NormalInput } from 'components/shared';
import { TrackerDateSectionBox } from '..';

const TrackerDateSection: React.FC<Props> = (props) => {
  const {
    selectPreviousWeek,
    selectNextWeek,
    startDateOnOBlurHandler,
    endDateOnOBlurHandler,
    getValues,
    isDayApproved,
  } = useTrackerDateSection(
    props.setSelectedDate,
    props.isSaving,
    props.selectedDate,
    props.dateArray,
    props.setDateArray,
  );

  return (
    <>
      <section className='flex items-center gap-4 mb-11'>
        <h3 className='text-zinc-700 font-medium'>Weeks</h3>

        <div className='flex items-center'>
          <button
            className='cursor-pointer hover:opacity-80'
            onClick={selectPreviousWeek}
            type='button'
          >
            <ArrowLeft />
          </button>

          <div className='flex items-center mt-1'>
            <NormalInput
              inputName={'start_date'}
              type='date'
              className='border-none p-0! font-medium! text-sm! bg-white px-0! text-[#5A636F]! hover:opacity-80 w-22!'
              hideDate
              doNotLeavePlaceForError
              blurHandler={startDateOnOBlurHandler}
            />

            <p className='pr-2'>-</p>

            <NormalInput
              inputName={'end_date'}
              type='date'
              className='border-none p-0! font-medium! text-sm! bg-white px-0! text-[#5A636F]! hover:opacity-80 w-22! -mr-2.5'
              hideDate
              doNotLeavePlaceForError
              blurHandler={endDateOnOBlurHandler}
            />
          </div>

          <button
            className='cursor-pointer rotate-180 hover:opacity-80'
            onClick={selectNextWeek}
            type='button'
          >
            <ArrowLeft />
          </button>
        </div>
      </section>

      <section className='flex flex-col sm:flex-row gap-3 sm:gap-6 mb-12'>
        <ol className='flex items-center gap-3 grow overflow-x-auto no-scrollbar'>
          {props.dateArray?.map((date, i) => {
            return (
              <TrackerDateSectionBox
                key={i}
                date={date}
                setSelectedDate={props.setSelectedDate}
                isLoading={props.isLoading}
                selectedDate={props.selectedDate}
                projects={date.projects}
              />
            );
          })}
        </ol>

        <div className='w-full sm:w-[15%] min-w-24 flex flex-col items-center justify-center border rounded-md py-[0.313rem]'>
          <div className='font-bold text-sm'>
            {!props.isLoading ? (
              `=${getValues('total')?.hours}hr ${getValues('total')?.minutes}m`
            ) : (
              <div className='w-12 h-5 bg-gray-300 animate-pulse rounded-sm' />
            )}
          </div>

          <p className='text-xs text-indigo-600'>Weekly Total</p>
        </div>
      </section>

      {isDayApproved ? (
        <div className='mb-[2.063rem] text-[#059669] font-medium bg-[#D1FAE5] w-[81%] py-[0.813rem] px-2 flex items-center gap-2'>
          <BlueExclamationCircle extColor='#D1FAE5' fill='#059669' />
          This day is already approved
        </div>
      ) : (
        props.isDaySubmitted && (
          <div className='flex items-center gap-2 rounded-md bg-indigo-50 text-indigo-600 p-4 py-3 mb-8'>
            <BlueExclamationCircle extColor='#4F46E5' fill='#AEADF0' />
            This day is already submitted
          </div>
        )
      )}
    </>
  );
};

export default TrackerDateSection;
