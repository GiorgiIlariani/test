import React from 'react';
import { Props } from './types';
import { AdvancedSelect } from 'components/shared';
import { DatePickerWithActions, UtilizationWidgetSkeleton, WidgetSkeletonHeader } from 'components';
import BigArrowLeft from 'components/icons/BigArrowLeft';
import BlueTick from 'components/icons/BlueTick';
import { twMerge } from 'tailwind-merge';
import { useUtilizationWidget } from './useUtilizationWidget';

const UtilizationWidget: React.FC<Props> = (props) => {
  const { dateChangedHandler, chartRef, router, getValues, utilizationLoading } =
    useUtilizationWidget(
      props.utilization,
      props.setUtilization,
      props.departments,
      props.dates,
      props.setDates,
    );

  return (
    <section className='w-full border border-zinc-200 rounded-md p-4 sm:p-6 text-slate-900 shadow-xs bg-white'>
      {props.isLoading || props.isWidgetLoading ? (
        <>
          <WidgetSkeletonHeader />
          <UtilizationWidgetSkeleton />
        </>
      ) : (
        <>
          <div className='flex flex-col xmd:flex-row justify-between gap-2 mb-3 sm:mb-4.5'>
            <h2
              onClick={() => router.push('/traffic?table=people')}
              className='font-bold text-xl flex w-fit gap-1 items-center hover:px-2 hover:bg-gray-100 cursor-pointer rounded-md transition-all group'
            >
              Utilization chart
              <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <BigArrowLeft />
              </span>
            </h2>

            <div className='grid xsm:grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-1'>
              <DatePickerWithActions
                dates={props.dates}
                setDates={props.setDates}
                dateChangedHandler={dateChangedHandler}
                dateFilterWrapperClassName='sm:left-0 sm:translate-x-0 xmd:left-1/2 xmd:-translate-x-1/2'
                thisYearClassName='md:block xl:hidden 1.5xl:block'
                thisQuarterClassName='2xl:block'
                thisMonthClassName='2.5xl:block'
              />

              <AdvancedSelect
                inputName={'utilization.department_id'}
                list={props.departments!}
                placeholder='Position'
                inputClassName='text-base xmd:text-xs font-medium focus:ring-0 focus:outline-hidden bg-gray-50 p-0 m-0 pl-2 pr-8 h-full! truncate! !md:w-24 border-none! group-hover:bg-gray-300!'
                className='w-full xsm:w-24 sm:w-28 h-8! p-0! m-0! hover:bg-gray-300! rounded-md border border-gray-100 bg-gray-50 group'
                externalButtonClassName='truncate! w-24!'
                chevronStyles='right-3 top-4 text-xs'
                noSearch
                removeErrorMessage
                removeChangeOnFocus
                dropDownStyles='top-7.5! right-0 w-full min-w-48'
                listItemStyles='text-sm xmd:text-xs border-none'
                doNotLeavePlaceForError
                openDropdownOnWrapperClick
              />

              <AdvancedSelect
                inputName={'utilization.chart_period'}
                list={[
                  { id: 1, title: 'Monthly' },
                  { id: 2, title: 'Quarterly' },
                  { id: 3, title: 'Yearly' },
                ]}
                placeholder='Chart period'
                inputClassName='text-base xmd:text-xs font-medium focus:ring-0 focus:outline-hidden bg-gray-50 p-0 m-0 pl-2 h-full!'
                className='w-full sm:w-30 xmd:w-23 h-8! p-0! m-0! xsm:col-span-full sm:col-span-1'
                chevronStyles='right-3 top-4 text-xs'
                noSearch
                removeErrorMessage
                removeChangeOnFocus
                dropDownStyles='top-7.5! right-0 w-full min-w-28'
                doNotLeavePlaceForError
                externalOptionTextRenderer={(value) => {
                  return (
                    <li
                      className={twMerge(
                        'cursor-pointer text-sm xmd:text-xs',
                        value.id === getValues('utilization.chart_period') &&
                          'text-zinc-700 flex gap-2 items-center',
                      )}
                    >
                      {value.title}
                      {value.id === getValues('utilization.chart_period') && (
                        <span className='mb-0.5'>
                          <BlueTick />
                        </span>
                      )}
                    </li>
                  );
                }}
                useOriginalValue
              />
            </div>
          </div>

          {utilizationLoading ? (
            <UtilizationWidgetSkeleton />
          ) : (
            <>
              <div className='w-full flex justify-end pr-3 mb-2.5'>
                <div className='flex gap-2 items-center mt-5 mb-4.5'>
                  <div className='flex gap-1 items-center'>
                    <div className='size-2 rounded-full bg-indigo-600'></div>
                    <p className='text-[#80807B] text-2xs leading-3'>Utilized</p>
                  </div>
                  <div className='flex gap-1 items-center'>
                    <div className='size-2 rounded-full bg-zinc-400'></div>
                    <p className='text-[#80807B] text-2xs leading-3'>Billable</p>
                  </div>
                </div>
              </div>

              <div className='border border-gray-100 rounded-md w-full pb-3 pr-3'>
                <div ref={chartRef} style={{ width: '100%', height: '350px' }}></div>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default UtilizationWidget;
