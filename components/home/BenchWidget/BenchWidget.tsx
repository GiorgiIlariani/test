import React from 'react';
import { Props } from './types';
import { AdvancedSelect } from 'components/shared';
import { BenchWidgetSkeleton, DatePickerWithActions, WidgetSkeletonHeader } from 'components';
import BigArrowLeft from 'components/icons/BigArrowLeft';
import {
  convertNumbersAsPrice,
  generateAvatarSrc,
  generateRandomString,
  getCurrencySymbol,
} from 'helpers';
import Image from 'next/image';
import { useBenchWidget } from './useBenchWidget';
import { percentage } from './helpers';
import { twMerge } from 'tailwind-merge';
import { MoneyInAllCurrency } from 'types';

const BenchWidget: React.FC<Props> = (props) => {
  const {
    dateChangedHandler,
    chartRef,
    router,
    getValues,
    departmentId,
    rateCard,
    department,
    benchLoading,
    sortedFilteredBenchEmployees,
  } = useBenchWidget(
    props.benchStats,
    props.setBenchStats,
    props.rateCards,
    props.dates,
    props.setDates,
  );

  return (
    <section
      className={twMerge(
        'w-full border border-zinc-200 rounded-md p-4 sm:p-6 text-slate-900 shadow-xs bg-white',
        props.isTopWidget && 'mt-0',
      )}
    >
      {props.isLoading || props.isWidgetLoading ? (
        <>
          <WidgetSkeletonHeader />
          <BenchWidgetSkeleton />
        </>
      ) : (
        <>
          <div className='flex flex-col sm:flex-row justify-between gap-2 mb-3 sm:mb-4.5'>
            <h2
              onClick={() => router.push('/reports/profitability')}
              className='font-bold text-xl flex w-fit gap-1 items-center hover:px-2 hover:bg-gray-100 cursor-pointer rounded-md transition-all group'
            >
              Bench stats
              <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <BigArrowLeft />
              </span>
            </h2>

            <div className='grid xsm:grid-cols-[1fr_auto] gap-1'>
              <DatePickerWithActions
                dates={props.dates}
                setDates={props.setDates}
                dateChangedHandler={dateChangedHandler}
                thisYearClassName='xmd:block'
                thisQuarterClassName='md:block xl:hidden 1.5xl:block'
                thisMonthClassName='md:block lg:hidden 1.5xl:block'
              />
              <AdvancedSelect
                inputName={'bench.department_id'}
                list={props.departments!}
                placeholder='Position'
                inputClassName='text-base xmd:text-xs font-medium focus:ring-0 focus:outline-hidden bg-gray-50 p-0 m-0 pl-2 pr-8 h-full! truncate! border-none! group-hover:bg-gray-300!'
                className='w-full xsm:w-24 sm:w-28 h-8! p-0! m-0! rounded-md border border-gray-100 bg-gray-50 hover:bg-gray-300! group'
                chevronStyles='right-3 top-4 text-xs'
                noSearch
                removeErrorMessage
                removeChangeOnFocus
                dropDownStyles='top-7.5 right-0 w-full xsm:w-48'
                listItemStyles='text-sm xmd:text-xs border-none'
                doNotLeavePlaceForError
                openDropdownOnWrapperClick
              />
            </div>
          </div>

          {benchLoading ? (
            <BenchWidgetSkeleton />
          ) : (
            <div className='flex flex-col sm:grid sm:grid-cols-[1.2fr_1fr] gap-3 w-full xl:h-72'>
              <div className='bg-white shadow-sm rounded-md px-3 py-6 xl:py-4 xl:px-6 flex justify-center flex-col xl:grid xl:grid-cols-2 xl:items-center gap-5 border border-[#F1F2F4] w-full xl:h-72'>
                <div className='relative flex items-center justify-center'>
                  <div
                    ref={chartRef}
                    style={{ width: '200px', height: '200px', margin: '0', padding: '0' }}
                    className='cursor-default!'
                  ></div>

                  <div className='absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-11 h-11 cursor-default'>
                    <span className='text-3xl font-bold'>
                      {departmentId ? department?.billable ?? 0 : props.benchStats?.billable}
                    </span>
                    <span className='text-sm text-zinc-700'>Billable</span>
                  </div>
                </div>

                <div className='flex flex-col items-center xl:items-start text-center xl:text-start gap-3'>
                  <div className='text-xs text-[#030229] mb-4'>
                    <div className='flex items-center mb-2'>
                      <span className='size-3.5 bg-indigo-50 rounded-full mr-2'></span>
                      Bench{' '}
                      {departmentId
                        ? 100 - percentage(department?.scheduled, department?.capacity)
                        : 100 - percentage(props.benchStats?.scheduled, props.benchStats?.capacity)}
                      %
                    </div>
                    <div className='flex items-center'>
                      <span className='size-3.5 bg-indigo-600 rounded-full mr-2'></span>
                      Utilized{' '}
                      {departmentId
                        ? percentage(department?.scheduled, department?.capacity)
                        : percentage(props.benchStats?.scheduled, props.benchStats?.capacity)}
                      %
                    </div>
                  </div>

                  <div className='text-sm text-[#030229]'>
                    <p className='mb-2'>
                      Bench Cost:{' '}
                      <span className='font-bold'>
                        {getCurrencySymbol(props.currency)}
                        {convertNumbersAsPrice(
                          departmentId
                            ? Math.round(
                                (
                                  props.benchStats?.cost_of_bench.departments[departmentId]
                                    ?.total as MoneyInAllCurrency
                                )?.[props.currency] ?? 0,
                              )
                            : Math.round(
                                props.benchStats?.cost_of_bench.total?.[props.currency] ?? 0,
                              ),
                        )}
                      </span>
                    </p>
                    <p>
                      Revenue Capacity:{' '}
                      <span className='font-bold'>
                        {getCurrencySymbol(props.currency)}
                        {convertNumbersAsPrice(
                          departmentId
                            ? Math.round(
                                (props.benchStats?.possible_revenue.departments[departmentId]?.[
                                  rateCard!
                                ] as number) ?? 0,
                              )
                            : Math.round(props.benchStats?.possible_revenue[rateCard!] ?? 0),
                        )}
                      </span>
                    </p>
                  </div>

                  <div className='mt-4'>
                    <AdvancedSelect
                      inputName={'bench.rate_card_id'}
                      list={props.rateCards!}
                      placeholder='Rate cards'
                      inputClassName='text-base xmd:text-xs font-medium focus:ring-0 focus:outline-hidden bg-gray-50 p-0 m-0 pl-2 h-8'
                      className='w-36 xmd:w-30 p-0! m-0!'
                      chevronStyles='right-3 top-4 text-xs'
                      noSearch
                      removeErrorMessage
                      removeChangeOnFocus
                      dropDownStyles='top-7.5! left-1/2 -translate-x-1/2 w-full'
                      listItemStyles='text-sm xmd:text-xs border-none'
                      doNotLeavePlaceForError
                      doNotRenderList={props.rateCards?.map((el) =>
                        el.id == getValues('bench.rate_card_id') ? el.id?.toString() : '',
                      )}
                      emptyStateText={'No rate cards'}
                    />
                  </div>
                </div>
              </div>

              <div className='bg-white border border-[#F1F2F4] shadow-sm rounded-md pt-3 h-72 sm:h-120 xl:h-72 w-full'>
                <h3 className='font-medium text-[#5A636F] text-[8px] mb-3 px-3'>BENCH LIST</h3>

                <ul className='h-[calc(100%-1.5rem)] overflow-y-auto'>
                  {sortedFilteredBenchEmployees?.map((item, index) => (
                    <li
                      key={index}
                      className='flex items-center justify-between mb-3 py-1 px-3 hover:bg-gray-50 transition-colors cursor-pointer'
                    >
                      <div className='flex items-center'>
                        <Image
                          id='changed_by'
                          className='h-8 w-8 object-cover rounded-full'
                          width={30}
                          height={30}
                          src={item.avatar ?? generateAvatarSrc(item.first_name, item.last_name)}
                          alt={'generated avatar' + generateRandomString?.()}
                        />
                        <div className='ml-3'>
                          <h4 className='text-xs font-medium text-[#030229]'>
                            {item.first_name} {item.last_name}
                          </h4>
                          <p className='text-2xs text-gray-500'>
                            {item.seniority} {item.position}
                          </p>
                        </div>
                      </div>

                      <div>
                        {item.archived_at && <p className='text-2xs text-gray-500'>Inactive</p>}
                        <p className='font-medium text-gray-600 text-sm'>
                          {percentage(item.bench, item.capacity) < 0
                            ? 0
                            : percentage(item.bench, item.capacity)}
                          %
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BenchWidget;
