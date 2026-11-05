import React from 'react';
import { Props } from './types';
('echarts');
import { AdvancedSelect, BasicSelect } from 'components/shared';
import BigArrowLeft from 'components/icons/BigArrowLeft';
import BlueTick from 'components/icons/BlueTick';
import { twMerge } from 'tailwind-merge';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { percentage } from './helpers';
import { useRevenueWidget } from './useRevenueWidget';
import {
  BlueExclamationCircle,
  DatePickerWithActions,
  RevenueWidgetSkeleton,
  WidgetSkeletonHeader,
} from 'components';
import { RevenueWidgetCalculation } from 'types';

const RevenueWidget: React.FC<Props> = (props) => {
  const {
    rateCard,
    dateChangedHandler,
    chartRef,
    revenueLoading,
    router,
    getValues,
    getHeaderPrices,
    getHeaderPercents,
  } = useRevenueWidget(
    props.revenue,
    props.rateCards,
    props.isLoading,
    props.isWidgetLoading,
    props.callback,
    props.dates,
    props.setDates,
    props.currency,
  );

  return (
    <section className='w-full border rounded-md p-4 sm:p-6 text-slate-900 shadow-xs bg-white'>
      {props.isLoading || props.isWidgetLoading ? (
        <>
          <WidgetSkeletonHeader />
          <RevenueWidgetSkeleton
            hideRateCardSelect={props.hideRateCardSelect}
            hideFooter={props.hideFooter}
          />
        </>
      ) : (
        <>
          <div className='flex flex-col sm:flex-row justify-between gap-2 mb-3 sm:mb-4.5'>
            <h2
              onClick={() => !props.hideRedirectLink && router.push('/reports/income')}
              className={twMerge(
                'font-bold text-xl flex w-fit gap-1 items-center transition-all group',
                !props.hideRedirectLink && 'cursor-pointer rounded-md hover:px-2 hover:bg-gray-100',
              )}
            >
              Financial overview
              {!props.hideRedirectLink && (
                <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <BigArrowLeft />
                </span>
              )}
            </h2>

            <DatePickerWithActions
              dates={props.dates}
              setDates={props.setDates}
              dateChangedHandler={dateChangedHandler}
              thisYearClassName='sm:block'
              thisQuarterClassName='xmd:block'
              thisMonthClassName='md:block xl:hidden 1.5xl:block'
            />
          </div>

          {revenueLoading ? (
            <RevenueWidgetSkeleton
              hideRateCardSelect={props.hideRateCardSelect}
              hideFooter={props.hideFooter}
            />
          ) : (
            <>
              <div className='border border-gray-100 rounded-md mb-3 p-3 sm:p-4 xl:px-6 grid items-center grid-rows-[1fr_auto_1fr_auto_1fr] xmd:grid-rows-none xmd:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3'>
                <div>
                  <h3 className='text-[#495264] text-xs font-medium mb-1.5 flex items-center gap-1'>
                    <span className='uppercase'>{props.headerNames?.[0]?.title}</span>

                    {props.headerNames?.[0]?.title === 'Revenue potential' && (
                      <div className='cursor-pointer group inline relative'>
                        <BlueExclamationCircle height={14} width={14} />

                        <p
                          className='hidden group-hover:block absolute bottom-[calc(100%+0.375rem)] left-1/2 -translate-x-1/2 z-10 xsm:ml-6 sm:ml-3 lg:ml-0 w-max
                          bg-white border border-gray-100 rounded-md py-2 px-4 text-xs text-gray-700 shadow-xs'
                        >
                          Revenue potential =
                          <br className='xsm:hidden' />
                          <span className='xsm:hidden'>&nbsp;&nbsp;</span> Revenue + (Bench *
                          selected rates card)
                        </p>
                      </div>
                    )}
                  </h3>

                  <div className='flex items-center gap-2'>
                    <p className='text-[1.375rem] xmd:text-lg md:text-[1.375rem] xl:text-lg [@media(min-width:1380px)]:text-[1.375rem]'>
                      {getCurrencySymbol(props.currency)}
                      {getHeaderPrices(props.headerNames?.[0]?.id)}
                    </p>
                    {!props.hideRateCardSelect && (
                      <AdvancedSelect
                        inputName={'revenue.rate_card_id'}
                        list={props.rateCards!}
                        placeholder='Rate cards'
                        inputClassName='text-base xmd:text-xs font-medium focus:ring-0 focus:outline-hidden bg-gray-50 p-0 m-0 pl-2 h-8'
                        className='w-34 xmd:w-28 p-0! m-0!'
                        chevronStyles='right-3 top-4 text-xs'
                        noSearch
                        removeErrorMessage
                        removeChangeOnFocus
                        dropDownStyles='top-7.5 left-1/2 -translate-x-1/2 w-full'
                        listItemStyles='text-sm xmd:text-xs border-none'
                        doNotRenderList={props.rateCards?.map((el) =>
                          el.id == getValues('revenue.rate_card_id') ? el.id?.toString() : '',
                        )}
                        emptyStateText={'No rate cards'}
                        doNotLeavePlaceForError
                      />
                    )}
                  </div>
                </div>

                <div className='bg-gray-100 w-[calc(100%-1rem)] xmd:w-px h-px xmd:h-11 mx-auto' />

                <div>
                  <div className='flex gap-5 items-center'>
                    <div>
                      <h3 className='text-[#495264] text-xs uppercase font-medium mb-1.5'>
                        {props.headerNames?.[1]?.title}
                      </h3>
                      <p className='text-[1.375rem] xmd:text-lg md:text-[1.375rem] xl:text-lg [@media(min-width:1380px)]:text-[1.375rem]'>
                        {getCurrencySymbol(props.currency)}
                        {getHeaderPrices(props.headerNames?.[1]?.id)}{' '}
                        <span className='text-sm'>
                          ({getHeaderPercents(props.headerNames?.[1]?.id)}
                          %)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-100 w-[calc(100%-1rem)] xmd:w-px h-px xmd:h-11 mx-auto' />

                <div>
                  <div className='flex gap-5 items-center'>
                    <div>
                      <h3 className='text-[#495264] text-xs uppercase font-medium mb-1.5'>
                        {props.headerNames?.[2]?.title}
                      </h3>
                      <p className='text-[1.375rem] xmd:text-lg md:text-[1.375rem] xl:text-lg [@media(min-width:1380px)]:text-[1.375rem]'>
                        {getCurrencySymbol(props.currency)}
                        {getHeaderPrices(props.headerNames?.[2]?.id)}{' '}
                        <span className='text-sm'>
                          ({getHeaderPercents(props.headerNames?.[2]?.id)}
                          %)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='border border-gray-100 rounded-md p-3 sm:p-4 xl:px-6'>
                <div className='flex flex-wrap justify-between items-center gap-2 mb-4.5'>
                  <div className='grid grid-cols-1 xsm:grid-cols-[1.75fr_1fr] items-center gap-2 w-full max-w-88 xmd:max-w-fit xmd:grid-cols-[11rem_7rem]'>
                    {!props.hideRateCardSelect && (
                      <BasicSelect
                        inputName='revenue.chart_type'
                        placeholder={getValues('revenue.chart_type')}
                        list={['Revenue/Gross Profit', 'Revenue/EBITDA']}
                        inputClassName='text-base xmd:text-xs focus:ring-0 focus:outline-hidden bg-gray-50 h-8 disabled:text-[#5A636F]'
                        dropDownStyles='top-7.5'
                        removeErrorMessage
                        noSearch
                        useOriginalValue
                        externalOptionTextRenderer={(value: number | string) => {
                          return (
                            <li
                              className={twMerge(
                                'cursor-pointer text-sm xmd:text-xs',
                                value === getValues('revenue.chart_type') &&
                                  'text-zinc-700 flex gap-2 items-center',
                              )}
                            >
                              {value}
                              {value === getValues('revenue.chart_type') && (
                                <span className='mb-0.5'>
                                  <BlueTick />
                                </span>
                              )}
                            </li>
                          );
                        }}
                      />
                    )}

                    <BasicSelect
                      inputName='revenue.chart_period'
                      placeholder={getValues('revenue.chart_period')}
                      list={['Monthly', 'Quarterly', 'Yearly']}
                      inputClassName='text-base xmd:text-xs focus:ring-0 focus:outline-hidden bg-gray-50 h-8'
                      dropDownStyles='top-7.5'
                      removeErrorMessage
                      noSearch
                      useOriginalValue
                      externalOptionTextRenderer={(value: number | string) => {
                        return (
                          <li
                            className={twMerge(
                              'cursor-pointer text-sm xmd:text-xs',
                              value === getValues('revenue.chart_period') &&
                                'text-zinc-700 flex gap-2 items-center',
                            )}
                          >
                            {value}
                            {value === getValues('revenue.chart_period') && (
                              <span className='mb-0.5'>
                                <BlueTick />
                              </span>
                            )}
                          </li>
                        );
                      }}
                    />
                  </div>

                  <div className='flex gap-2 items-center'>
                    <div className='flex gap-1 items-center'>
                      <div className='w-[7px] h-[7px] rounded-full bg-indigo-600'></div>
                      <p className='text-[#80807B] text-2xs'>
                        {getValues('revenue.chart_type')?.split('/')?.[0]}
                      </p>
                    </div>

                    <div className='flex gap-1 items-center'>
                      <div className='w-[7px] h-[7px] rounded-full bg-zinc-200'></div>
                      <p className='text-[#80807B] text-2xs'>
                        {getValues('revenue.chart_type')?.split('/')?.[1]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='overflow-x-auto overflow-y-hidden'>
                  <div
                    ref={chartRef}
                    style={{
                      width: '100%',
                      minWidth: '600px',
                      height: '250px',
                      margin: '0',
                      padding: '0',
                    }}
                  ></div>
                </div>

                {!props.hideFooter && (
                  <footer className='flex items-center gap-x-10 md:gap-x-12 gap-y-3 flex-wrap mt-4.5 font-medium'>
                    <div>
                      <h3 className='uppercase text-zinc-400 text-[8px]'>Project Costs</h3>
                      <p className='text-[#5A636F] text-xs'>
                        {getCurrencySymbol(props.currency)}
                        {convertNumbersAsPrice(
                          (props.revenue as RevenueWidgetCalculation)?.cost_of_projects?.[
                            props.currency
                          ] ?? 0,
                        )}{' '}
                      </p>
                    </div>
                    <div>
                      <h3 className='uppercase text-zinc-400 text-[8px]'>Project Gross Profit</h3>
                      <p className='text-[#5A636F] text-xs'>
                        {getCurrencySymbol(props.currency)}
                        {convertNumbersAsPrice(
                          (props.revenue as RevenueWidgetCalculation)?.total_gross_profit?.[
                            props.currency
                          ] ?? 0,
                        )}{' '}
                        <span>
                          {' '}
                          (
                          {percentage(
                            (props.revenue as RevenueWidgetCalculation)?.total_gross_profit?.[
                              props.currency
                            ],
                            (props.revenue as RevenueWidgetCalculation)?.adjusted_revenue?.[
                              props.currency
                            ],
                            rateCard,
                          )}
                          %)
                        </span>
                      </p>
                    </div>
                    <div>
                      <h3 className='uppercase text-zinc-400 text-[8px]'>
                        Unutilized Resources Costs
                      </h3>
                      <p className='text-[#5A636F] text-xs'>
                        {getCurrencySymbol(props.currency)}
                        {convertNumbersAsPrice(
                          (props.revenue as RevenueWidgetCalculation)?.non_project_cogs?.[
                            props.currency
                          ] ?? 0,
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className='uppercase text-zinc-400 text-[8px]'>ADMIN COSTS</h3>
                      <p className='text-[#5A636F] text-xs'>
                        {getCurrencySymbol(props.currency)}
                        {convertNumbersAsPrice(
                          (props.revenue as RevenueWidgetCalculation)?.admin_costs?.[
                            props.currency
                          ] ?? 0,
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className='uppercase text-zinc-400 text-[8px]'>EBITDA</h3>
                      <p className='text-[#5A636F] text-xs'>
                        {getCurrencySymbol(props.currency)}
                        {convertNumbersAsPrice(
                          (props.revenue as RevenueWidgetCalculation)?.net_profit?.[
                            props.currency
                          ] ?? 0,
                        )}{' '}
                        <span>
                          {' '}
                          (
                          {percentage(
                            (props.revenue as RevenueWidgetCalculation)?.net_profit?.[
                              props.currency
                            ],
                            (props.revenue as RevenueWidgetCalculation)?.adjusted_revenue?.[
                              props.currency
                            ],
                            rateCard,
                          )}
                          %)
                        </span>
                      </p>
                    </div>
                  </footer>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default RevenueWidget;
