import { Props } from './types';
import React from 'react';
import { ChevronRight } from 'components/icons';
import { useTimeOffTableItem } from './useTimeOffTableItem';
import { TimeOffItemDropdownItem } from 'components/traffic';

const TimeOffTableItem: React.FC<Props> = (props) => {
  const { dropdownIsOpen, toggleDropdownIsOpen } = useTimeOffTableItem();

  return (
    <>
      <div
        className={`${
          props.last && !dropdownIsOpen && 'rounded-bl-md'
        } col-span-5 last-of-type::rounded-bl-md ${
          dropdownIsOpen ? 'border-x border-t' : 'border'
        }  border-gray-100 ${dropdownIsOpen ? 'pb-2 pt-5' : 'py-5'} pl-6 bg-white text-zinc-700`}
      >
        <div
          onClick={() => props.timeOffItem.users.length !== 0 && toggleDropdownIsOpen()}
          className='flex items-center space-x-4'
        >
          <button
            className={`${dropdownIsOpen ? 'rotate-90' : 'rotate-0'} transition-all  duration-200`}
          >
            <ChevronRight
              color={`${props.timeOffItem.users.length === 0 ? '#dfe2e6' : '#9CA3AF'}`}
            />
          </button>
          <span className='capitalize'>{props.timeOffType.replaceAll('_', ' ')}</span>
        </div>
      </div>
      <div
        className={`col-span-6 ${
          dropdownIsOpen ? 'border-x border-t' : 'border'
        }    border-gray-100 ${dropdownIsOpen ? 'pb-2 pt-5' : 'py-5'}  pl-6 bg-white text-zinc-700`}
      ></div>
      <div
        className={`col-span-2   ${
          dropdownIsOpen ? 'border-x border-t' : 'border'
        }   border-gray-100 ${dropdownIsOpen ? 'pb-2 pt-5' : 'py-5'}  pl-6 bg-white text-zinc-700`}
      >
        {props.timeOffItem.hours}
      </div>
      <div
        className={`col-span-2 ${
          dropdownIsOpen ? 'border-x border-t' : 'border'
        }  border-gray-100 ${dropdownIsOpen ? 'pb-2 pt-5' : 'py-5'}  pl-6 bg-white text-zinc-700`}
      >
        {props.timeOffItem.excluded_hours}
      </div>
      <div
        className={`col-span-8  ${dropdownIsOpen ? 'border-x border-t' : 'border'}  ${
          props.last && !dropdownIsOpen && 'rounded-br-md'
        }  border-gray-100 ${dropdownIsOpen ? 'pb-2 pt-5' : 'py-5'}  pl-6 bg-white text-zinc-700`}
      >
        {props.timeOffItem.excluded_percentage}%
      </div>
      {dropdownIsOpen &&
        props.timeOffItem.users.map((employee) => {
          return (
            <TimeOffItemDropdownItem
              key={employee.id}
              employee={employee}
              last={props.last}
              permissions={props.permissions}
            />
          );
        })}
    </>
  );
};

export default TimeOffTableItem;
