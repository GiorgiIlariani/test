import React from 'react';
import { Props } from './types';

const FilterTableColumns: React.FC<Props> = (props) => {
  const filteredTitles =
    props.list[0]?.title === '#' ? props.list.filter((item) => item.title !== '#') : props.list;
  return (
    <div className='absolute top-4 right-76 mt-5 pb-2 z-50 bg-white'>
      {props.isOpen && (
        <div
          ref={props.dropdownRef}
          className='absolute top-full left-0 z-20 mt-1 flex max-h-60 w-[18rem] flex-col items-center justify-start overflow-auto rounded-lg border border-gray-200 bg-white py-4 px-6'
        >
          {filteredTitles?.map((option) => (
            <label
              key={option.id}
              className='flex w-full items-center justify-between space-x-4 py-2'
            >
              <span className='text-zinc-700 text-base'>{option.title}</span>

              <input
                type='checkbox'
                name={option.title}
                checked={option.isChecked}
                disabled={option.disabled}
                onClick={() => {
                  props.optionsChangeHandler(option);
                }}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterTableColumns;
