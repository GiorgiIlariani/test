import { Props } from './types';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'components';
import { twMerge } from 'tailwind-merge';

const ArrowNavigation: React.FC<Props> = (props) => {
  return (
    <div className='flex gap-2 md:pr-6'>
      <button
        type='button'
        onClick={() => {
          props.previousVacationModalData();
          props.disableApproveRejectStaticState(
            props.userId,
            props.vacationData[props.currentVacationInfo.currentIndex - 1].reviewers,
          );
          props.resetReviewingAndCanNotEdit(
            props.vacationData[props.currentVacationInfo.currentIndex - 1],
          );
        }}
        disabled={props.currentVacationInfo.currentIndex === 0}
        className={twMerge(
          'size-6 rounded-full bg-gray-100 flex items-center justify-center transition-colors',
          props.currentVacationInfo.currentIndex === 0
            ? 'opacity-20 cursor-default'
            : 'hover:bg-gray-200',
        )}
      >
        <ChevronLeft color='#323841' />
      </button>

      <button
        type='button'
        onClick={() => {
          props.nextVacationModalData();
          props.disableApproveRejectStaticState(
            props.userId,
            props.vacationData[props.currentVacationInfo.currentIndex + 1]?.reviewers,
          );
          props.resetReviewingAndCanNotEdit(
            props.vacationData[props.currentVacationInfo.currentIndex + 1],
          );
        }}
        disabled={props.currentVacationInfo.currentIndex === props.currentVacationInfo.sum - 1}
        className={twMerge(
          'size-6 rounded-full bg-gray-100 flex items-center justify-center transition-colors',
          props.currentVacationInfo.currentIndex === props.currentVacationInfo.sum - 1
            ? 'opacity-20 cursor-default'
            : 'hover:bg-gray-200',
        )}
      >
        <ChevronRight color='#323841' />
      </button>
    </div>
  );
};

export default ArrowNavigation;
