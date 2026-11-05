import { Props } from './types';
import React from 'react';
import { AdvancedSelect, TrafficHeaderSkeleton } from 'components';
import { FormProvider } from 'react-hook-form';
import { percentage } from 'components/home/RevenueWidget/helpers';
import { twMerge } from 'tailwind-merge';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';

const TrafficHeader: React.FC<Props> = (props) => {
  const rateCard =
    props.rateCards && props.form
      ? props.rateCards?.find((card) => card.id === props.form!.getValues('rate_card_id'))?.title
      : '';

  const capacity = rateCard
    ? (props.statisticsHeader as any)?.[props.headerTitles[0][`field`]]?.[rateCard]
    : (props.statisticsHeader as any)?.[props.headerTitles[0]['field']];

  const revenue = (props.statisticsHeader as any)?.[props.headerTitles[1]['field']];

  const revenuePercentage =
    props.currency && percentage(revenue?.[props.currency], capacity, rateCard);

  return (
    <div className='flex bg-white border border-gray-100 rounded-md  my-6 w-full'>
      {props.statisticsIsLoading ? (
        <TrafficHeaderSkeleton
          headerTitles={props.headerTitles}
          swapLastAndPreviousWidget={props.swapLastAndPreviousWidget}
        />
      ) : (
        <>
          <section
            className={twMerge(
              'flex flex-col gap-2 border-r border-gray-100 px-6 py-6 w-[14%]',
              props.isProfitability && 'w-[22%]',
            )}
          >
            <h3 className='text-sm'>{props.headerTitles[0]['title']}</h3>
            <div className='flex gap-3'>
              <p className='text-2xl font-bold truncate'>
                {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                {convertNumbersAsPrice(capacity ?? 0)}
                {!props.isProfitability && 'h'}
              </p>
              {props.form && (
                <FormProvider {...props.form}>
                  <form>
                    <AdvancedSelect
                      inputName={'rate_card_id'}
                      list={props.rateCards!}
                      placeholder='Rate cards'
                      inputClassName='text-xs! font-medium focus:ring-0 focus:outline-hidden bg-gray-50 p-0 m-0 pl-2 h-8'
                      className='w-30 p-0! m-0!'
                      chevronStyles='right-3 top-4 text-xs'
                      noSearch
                      removeErrorMessage
                      removeChangeOnFocus
                      dropDownStyles='top-7! w-30'
                      doNotRenderList={props.rateCards?.map((el) =>
                        el.id == props.form!.getValues('rate_card_id') ? el.id?.toString() : '',
                      )}
                      emptyStateText={'No rate cards'}
                      doNotLeavePlaceForError
                    />
                  </form>
                </FormProvider>
              )}
            </div>
          </section>
          <section
            className={twMerge(
              'flex gap-6 border-r border-gray-100 px-6 py-6 w-[43%]',
              props.isProfitability && 'w-[35%]',
            )}
          >
            <div className='flex flex-col gap-2 w-[29%]'>
              <h3 className='text-sm'>
                {props.headerTitles[1]['title']}{' '}
                <span className='text-zinc-400'>
                  {!props.isProfitability
                    ? (props.statisticsHeader as any)?.[props.headerTitles[1]['percentageField']!]
                    : revenuePercentage}
                  %
                </span>
              </h3>
              <p className='text-2xl font-bold truncate'>
                {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                {convertNumbersAsPrice(
                  props.currency
                    ? (props.statisticsHeader as any)?.[props.headerTitles[1]['field']]?.[
                        props.currency
                      ] ?? 0
                    : (props.statisticsHeader as any)?.[props.headerTitles[1]['field']] ?? 0,
                )}
                {!props.isProfitability && 'h'}
              </p>
            </div>
            <div className='flex flex-col gap-2 w-[69%]'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-[#0D9488] rounded-full' />
                  <h3>{props.headerTitles[2]['title']}</h3>
                </div>

                <div className='flex gap-3'>
                  <p className='truncate'>
                    {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                    {convertNumbersAsPrice(
                      props.currency
                        ? (props.statisticsHeader as any)?.[props.headerTitles[2]['field']]?.[
                            props.currency
                          ] ?? 0
                        : (props.statisticsHeader as any)?.[props.headerTitles[2]['field']] ?? 0,
                    )}
                    {!props.isProfitability && 'h'}
                  </p>
                  {props.headerTitles[2]['percentageField'] && (
                    <p className='text-zinc-400'>
                      {(props.statisticsHeader as any)?.[props.headerTitles[2]['percentageField']!]
                        ?.toFixed()
                        ?.toLocaleString()}
                      %
                    </p>
                  )}
                </div>
              </div>
              <div className='flex justify-between w-full'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-[#0284C7] rounded-full' />
                  <h3>{props.headerTitles[3]['title']}</h3>
                </div>

                <div className='flex gap-3'>
                  <p className='truncate'>
                    {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                    {convertNumbersAsPrice(
                      props.currency
                        ? (props.statisticsHeader as any)?.[props.headerTitles[3]['field']]?.[
                            props.currency
                          ] ?? 0
                        : (props.statisticsHeader as any)?.[props.headerTitles[3]['field']] ?? 0,
                    )}
                    {!props.isProfitability && 'h'}
                  </p>
                  {props.headerTitles[3]['percentageField'] && (
                    <p className='text-zinc-400'>
                      {(props.statisticsHeader as any)?.[props.headerTitles[3]['percentageField']!]
                        ?.toFixed()
                        ?.toLocaleString()}
                      %
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
          {!props.swapLastAndPreviousWidget && (
            <section className='w-[15%]'>
              <div className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6'>
                <h3 className='text-sm'>
                  {props.headerTitles[4]['title']}{' '}
                  <span className='text-zinc-400'>
                    {(props.statisticsHeader as any)?.[props.headerTitles[4]['percentageField']!]}%
                  </span>
                </h3>

                <p className='text-2xl font-bold truncate'>
                  {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                  {convertNumbersAsPrice(
                    props.currency
                      ? (props.statisticsHeader as any)?.[props.headerTitles[4]['field']]?.[
                          props.currency
                        ] ?? 0
                      : (props.statisticsHeader as any)?.[props.headerTitles[4]['field']] ?? 0,
                  )}
                  {!props.isProfitability && 'h'}
                </p>
              </div>
            </section>
          )}
          <section className='flex gap-2 border-r border-gray-100 px-6 py-6 w-[36%]'>
            <div className='flex flex-col gap-2 w-[29%]'>
              <h3 className='text-sm'>{props.headerTitles[5]['title']} </h3>
              <p className='text-2xl font-bold truncate'>
                {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                {convertNumbersAsPrice(
                  props.currency
                    ? (props.statisticsHeader as any)?.[props.headerTitles[5]['field']]?.[
                        props.currency
                      ] ?? 0
                    : (props.statisticsHeader as any)?.[props.headerTitles[5]['field']] ?? 0,
                )}
                {!props.isProfitability && 'h'}
              </p>
            </div>
            <div className='flex flex-col gap-2 w-[69%]'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-[#0D9488] rounded-full' />
                  <h3>{props.headerTitles[6]['title']}</h3>
                </div>

                <div className='flex gap-4'>
                  <p className='truncate'>
                    {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                    {convertNumbersAsPrice(
                      props.currency
                        ? (props.statisticsHeader as any)?.[props.headerTitles[6]['field']]?.[
                            props.currency
                          ] ?? 0
                        : (props.statisticsHeader as any)?.[props.headerTitles[6]['field']] ?? 0,
                    )}
                    {!props.isProfitability && 'h'}
                  </p>
                  <p className='text-zinc-400'>
                    {(props.statisticsHeader as any)?.[props.headerTitles[6]['percentageField']!]
                      ?.toFixed()
                      ?.toLocaleString()}
                    %
                  </p>
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-[#0284C7] rounded-full' />
                  <h3>{props.headerTitles[7]['title']}</h3>
                </div>

                <div className='flex gap-4'>
                  <p className='truncate'>
                    {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                    {convertNumbersAsPrice(
                      props.currency
                        ? (props.statisticsHeader as any)?.[props.headerTitles[7]['field']]?.[
                            props.currency
                          ] ?? 0
                        : (props.statisticsHeader as any)?.[props.headerTitles[7]['field']] ?? 0,
                    )}
                    {!props.isProfitability && 'h'}
                  </p>
                  <p className='text-zinc-400'>
                    {(props.statisticsHeader as any)?.[props.headerTitles[7]['percentageField']!]
                      ?.toFixed()
                      ?.toLocaleString()}
                    %
                  </p>
                </div>
              </div>
            </div>
          </section>
          {props.swapLastAndPreviousWidget && (
            <section className='w-[15%]'>
              <div className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6'>
                <h3 className='text-sm'>
                  {props.headerTitles[4]['title']}{' '}
                  <span className='text-zinc-400'>
                    {(props.statisticsHeader as any)?.[props.headerTitles[4]['percentageField']!]}%
                  </span>
                </h3>

                <p className='text-2xl font-bold truncate'>
                  {props.isProfitability && props.currency && getCurrencySymbol(props.currency)}
                  {convertNumbersAsPrice(
                    props.currency
                      ? (props.statisticsHeader as any)?.[props.headerTitles[4]['field']]?.[
                          props.currency
                        ] ?? 0
                      : (props.statisticsHeader as any)?.[props.headerTitles[4]['field']] ?? 0,
                  )}
                  {!props.isProfitability && 'h'}
                </p>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default TrafficHeader;
