import { ProgressCircle } from 'components/shared';
import { Props } from './types';
import React from 'react';
import { TickCircle } from 'components/icons';
import { analytics } from 'helpers';

const ReadyToBookWidget: React.FC<Props> = (props) => {
  const showDeleteScopeButton = props.isInOnePhaseEditMode
    ? props.allPhasesLength === 1 && props.phaseLength === 0
    : props.phaseLength === 0;

  const nextIsNotDisabled = props.isInOnePhaseEditMode
    ? props.readyToBookPhases || (props.phaseLength === 0 && props.allPhasesLength !== 1)
    : props.readyToBookPhases;

  return (
    <section className='bg-white h-28 w-md border-l-2 border-t-2 border-zinc-200 py-6 pl-6 pr-12 absolute bottom-0 right-1 flex justify-between items-center text-zinc-700 rounded-tl-md'>
      <div>
        <div className='flex items-center gap-1'>
          {props.readyToBookPhases === 0 ? (
            <ProgressCircle
              progress={0}
              baseColor='#F1F2F4'
              fillColor='#059669'
              size={1.11}
              innerSize={1}
              hideContent
            />
          ) : (
            <TickCircle className='w-6 h-6' />
          )}
          <p className='text-xs text-zinc-700 cursor-pointer'>{`${props.readyToBookPhases}/${props.phaseLength} phases are ready to book`}</p>
        </div>

        <p className='text-[#5A636F] text-2xs mt-1.5 w-56'>
          You can also select the phases you want to book later.
        </p>
      </div>
      <div className='flex items-center flex-col'>
        {showDeleteScopeButton ? (
          <button
            type='button'
            className='ml-4 h-10 rounded-md flex gap-2 items-center py-1 px-7 bg-red-600 hover:bg-red-700 text-white text-xs font-medium focus:ring-offset-2 focus:ring-red-500'
            onClick={props.openDeleteScopeModal}
          >
            Delete Scope
          </button>
        ) : (
          <button
            disabled={!nextIsNotDisabled}
            type='button'
            className='ml-4 rounded-md flex gap-2 items-center py-2 px-7 bg-indigo-600 disabled:bg-[#DFE2E7] disabled:opacity-25 disabled:text-zinc-700 hover:bg-indigo-800 focus:ring-indigo-600 text-white text-sm font-medium focus:ring-offset-2'
            onClick={() => {
              props.openBookModal(true);
              analytics.track(
                `Budget publish - ${props.publishedBudgetIsInEditMode ? 'Next' : 'Book'}`,
              );
            }}
          >
            {props.publishedBudgetIsInEditMode ? 'Next' : 'Book'}
          </button>
        )}
        <button
          type='button'
          className={`${
            props.publishedBudgetIsInEditMode && !props.projectDoesNotExists
              ? 'hover:underline'
              : ''
          } text-[#5A636F] text-xs mt-1 disabled:opacity-50`}
          disabled={!nextIsNotDisabled || showDeleteScopeButton}
          onClick={() => {
            props.publishedBudgetIsInEditMode ? () => {} : props.openBookModal(false);
          }}
        >
          {!props.publishedBudgetIsInEditMode && (
            <span className='text-zinc-400'>is it final? </span>
          )}
          <span
            className={`${
              props.readyToBookPhases && !props.publishedBudgetIsInEditMode && 'hover:underline'
            } font-medium`}
          >
            {props.publishedBudgetIsInEditMode ? '' : 'Activate'}
          </span>
        </button>
      </div>
    </section>
  );
};

export default ReadyToBookWidget;
