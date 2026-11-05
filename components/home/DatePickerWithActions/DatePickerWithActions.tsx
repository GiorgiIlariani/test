import React from 'react';
import GrayCalendar from 'components/icons/GrayCalendar';
import BlueTick from 'components/icons/BlueTick';
import { twMerge } from 'tailwind-merge';
import { Props } from './types';
import { useDatePickerWithActions } from './useDatePickerWithActions';
import { DateFilter } from 'components/shared';

const DatePickerWithActions: React.FC<Props> = (props) => {
  const {
    toggleOpen,
    toggleHamburger,
    hamburgerRef,
    hamburgerButtonRef,
    selectedAction,
    setSelectedAction,
    actions,
    buttonRef,
    dateFilterRef,
    isOpen,
    isHamburgerOpen,
  } = useDatePickerWithActions(props.dates, props.dateChangedHandler);

  return (
    <div className='relative h-8 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] text-xs font-medium bg-gray-50 border border-gray-100 divide-x divide-gray-100 rounded-md'>
      <div className='relative h-full'>
        <button
          ref={buttonRef}
          className='cursor-pointer size-full px-2.5 flex gap-1 items-center justify-center hover:bg-gray-100 text-[#5A636F] hover:text-slate-900 rounded-l-md transition-colors group'
          onClick={toggleOpen}
          type='button'
        >
          <GrayCalendar
            className='shrink-0'
            pathClassName='group-hover:stroke-[#050f26] transition-colors'
          />
          Custom:{' '}
          <span>
            {props.dates.startDate.toLocaleString('default', { month: 'short' })}{' '}
            {props.dates.startDate.getFullYear()}
            {' - '}
            {props.dates.endDate.toLocaleString('default', { month: 'short' })}{' '}
            {props.dates.endDate.getFullYear()}
          </span>
        </button>

        <DateFilter
          key={`${props.dates.startDate.toISOString()}-${props.dates.endDate.toISOString()}`}
          wrapperClasses={props.dateFilterWrapperClassName}
          dateDropdownRef={dateFilterRef}
          addOrEditDateFilter={(fieldData) => {
            if (fieldData.meta) {
              const { endDate, startDate } = fieldData.meta;
              if (endDate && startDate) {
                props.setDates({
                  endDate,
                  startDate,
                });
                props.dateChangedHandler({
                  endDate,
                  startDate,
                });
                setSelectedAction('custom');
              }
            }
          }}
          addingInsideSelectedFilter={{
            meta: {
              ...props.dates,
            },
            id: 0,
            type: 'date',
            value: '',
          }}
          backHandler={toggleOpen}
          isOpen={isOpen}
          filterOptions={[]}
          doNotShowLabel
        />
      </div>

      <button
        className={twMerge(
          'cursor-pointer size-full px-2.5 hover:bg-gray-100 hover:text-slate-900  text-[#5A636F] transition-colors hidden',
          props.thisYearClassName,
        )}
        onClick={() =>
          props.setDates(() => {
            const startDate = new Date(new Date().getFullYear(), 0, 1);
            const endDate = new Date(new Date().getFullYear(), 11, 31);

            setSelectedAction('custom');
            props.dateChangedHandler({
              endDate,
              startDate,
            });
            return { startDate, endDate };
          })
        }
        type='button'
      >
        This year
      </button>

      <button
        className={twMerge(
          'cursor-pointer size-full px-2.5 hover:bg-gray-100 hover:text-slate-900  text-[#5A636F] transition-colors hidden',
          props.thisQuarterClassName,
        )}
        onClick={() => {
          props.setDates(() => {
            const currentMonth = new Date().getMonth();
            let startDate, endDate;

            if (currentMonth >= 0 && currentMonth <= 2) {
              startDate = new Date(new Date().getFullYear(), 0, 1);
              endDate = new Date(new Date().getFullYear(), 2, 31);
            } else if (currentMonth >= 3 && currentMonth <= 5) {
              startDate = new Date(new Date().getFullYear(), 3, 1);
              endDate = new Date(new Date().getFullYear(), 5, 30);
            } else if (currentMonth >= 6 && currentMonth <= 8) {
              startDate = new Date(new Date().getFullYear(), 6, 1);
              endDate = new Date(new Date().getFullYear(), 8, 30);
            } else {
              startDate = new Date(new Date().getFullYear(), 9, 1);
              endDate = new Date(new Date().getFullYear(), 11, 31);
            }

            props.dateChangedHandler({
              endDate,
              startDate,
            });
            setSelectedAction('custom');
            return { startDate, endDate };
          });
        }}
        type='button'
      >
        This quarter
      </button>

      <button
        className={twMerge(
          'cursor-pointer size-full px-2.5 hover:bg-gray-100 hover:text-slate-900  text-[#5A636F] transition-colors hidden',
          props.thisMonthClassName,
        )}
        onClick={() =>
          props.setDates(() => {
            const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

            setSelectedAction('custom');
            props.dateChangedHandler({
              endDate,
              startDate,
            });
            return { startDate, endDate };
          })
        }
        type='button'
      >
        This month
      </button>

      <div className='relative'>
        <button
          type='button'
          ref={hamburgerButtonRef}
          className='cursor-pointer size-full px-2.5 w-full hover:bg-gray-100 hover:text-slate-900 rounded-r-md transition-colors group'
          onClick={toggleHamburger}
        >
          <div className='flex flex-col items-center justify-center'>
            <span className='block w-3 h-px bg-[#5A636F] group-hover:bg-slate-900 transition-colors'></span>
            <span className='block w-3 h-px bg-[#5A636F] group-hover:bg-slate-900 transition-colors my-0.5'></span>
            <span className='block w-3 h-px bg-[#5A636F] group-hover:bg-slate-900 transition-colors'></span>
          </div>
        </button>

        {isHamburgerOpen && (
          <div
            ref={hamburgerRef}
            className='absolute right-0 mt-2 w-36 top-6.5 bg-white border rounded-md shadow-lg z-50'
          >
            <ul className='text-[#5A636F] text-left'>
              {actions.map((action) => (
                <li
                  key={action.value}
                  onClick={() => {
                    toggleHamburger();
                    props.setDates(action.setDateRange);
                    setSelectedAction(action.value);
                  }}
                  className={twMerge(
                    'px-3 py-2 cursor-pointer hover:bg-gray-100 hover:text-slate-900 transition-colors',
                    selectedAction === action.value && 'text-slate-900 flex gap-2 items-center',
                  )}
                >
                  {action.label}
                  {selectedAction === action.value && (
                    <span className='mb-0.5'>
                      <BlueTick />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerWithActions;
