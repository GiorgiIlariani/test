import { DownChevron } from 'components';
import React from 'react';
import { useCareerLogFilter } from './useCareerLogFilter';
import { Props } from './types';
import { analytics } from 'helpers';

const CareerLogFilter: React.FC<Props> = (props) => {
  const { isOpen, dropdownToggler, buttonRef, dropdownRef } = useCareerLogFilter();

  return (
    <div className='relative mt-5 pb-2 z-50 bg-white'>
      <button
        ref={buttonRef}
        onClick={dropdownToggler}
        className='flex w-fit items-center space-x-2 rounded-md border border-gray-200 py-2 px-4 font-medium text-gray-800'
      >
        <span className='text-sm'>Options</span>
        <span className='rounded-lg bg-violet-600/16 p-1 text-xs text-indigo-600'>
          {props.careerFilter.filter((item) => item.checked === true).length}
        </span>
        <DownChevron />
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute top-full left-0 z-20 mt-1 flex max-h-60 w-[18rem] flex-col items-center justify-start overflow-auto rounded-lg border border-gray-200 bg-white py-2 px-4'
        >
          <div className='flex w-full items-center justify-start space-x-4 py-2'>
            <input
              type='checkbox'
              name={'All'}
              checked={props.checkAllFilter}
              onChange={() => props.checkAllOptionsChangeHandler()}
            />
            <span className='text-gray-800 text-base'>All</span>
          </div>
          {props.careerFilter?.map((option) => (
            <label
              key={option.id}
              className='flex w-full items-center justify-start space-x-4 py-2'
            >
              <input
                type='checkbox'
                name={option.title}
                checked={option.checked}
                onChange={(e) => {
                  props.optionsChangeHandler(option);
                  e.target.checked &&
                    analytics.track(`Career Log Options - ${option.title} Selected`);
                }}
              />
              <span className='text-gray-800 text-base'>{option.title}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerLogFilter;
