import Head from 'next/head';
import { Props } from './types';
import { ActionButton, DateFilter, BookedCheckbox, TrafficHeader } from 'components';
import { useTrafficWrapper } from './useTrafficWrapper';
import { analytics } from 'helpers';

const TrafficWrapper: React.FC<Props> = (props) => {
  const { isOpen, toggleOpen, dateFilterRef, buttonRef } = useTrafficWrapper();
  const { endDate, startDate } = props.dates;
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>

      <div className='flex items-center space-x-6 justify-between'>
        <div className='flex gap-6'>
          <h1 className={`block text-2xl font-bold text-gray-900 `}>{props.title}</h1>

          <div className='relative'>
            <button
              ref={buttonRef}
              className=' py-1  hover:bg-violet-50 rounded-md'
              onClick={toggleOpen}
            >
              Date:{' '}
              <span className='text-indigo-600'>
                {startDate.getDate()} {startDate.toLocaleString('default', { month: 'short' })}{' '}
                {startDate.getFullYear()}
                {' - '}
                {endDate.getDate()} {endDate.toLocaleString('default', { month: 'short' })}{' '}
                {endDate.getFullYear()}
              </span>
            </button>
            <DateFilter
              wrapperClasses='left-0!'
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
            />
          </div>
          <BookedCheckbox isBooked={props.isBooked} onChange={props.changeBookedHandler} />
        </div>
        {!props.showCSVDownload && (
          <button
            onClick={() => props.getCSVHandler()}
            className='disabled:opacity-25'
            disabled={props.statisticsIsLoading}
          >
            <ActionButton
              buttonText={'Export Csv'}
              className={'w-38 px-4 py-2 rounded-md border border-zinc-200 text-zinc-700'}
              icon={'csv'}
              isLoading={props.scvButtonIsLoading}
            />
          </button>
        )}
      </div>
      <TrafficHeader
        rateCards={props.rateCards}
        form={props.form}
        statisticsHeader={props.statisticsHeader}
        statisticsIsLoading={props.statisticsIsLoading}
        headerTitles={props.headerTitles}
        swapLastAndPreviousWidget={props.swapLastAndPreviousWidget}
        isProfitability={props.isProfitability}
        currency={props.currency}
      />

      {props.showNav && (
        <div className='mb-4 flex items-center justify-between'>
          <nav className='flex gap-6'>
            <div
              onClick={() => {
                props.navigateTabs('people');
                analytics.track('Traffic - People Tab');
              }}
              className='cursor-pointer'
            >
              <a
                className={`${
                  props.currentPage === 'people'
                    ? ' border-b-2 border-[#4F46E5] text-[#4F46E5] font-medium'
                    : 'font-normal text-zinc-400 hover:text-zinc-600'
                } -mb-[2px] py-3 flex gap-1`}
              >
                People{' '}
              </a>
            </div>
            <div
              onClick={() => {
                props.navigateTabs('projects');
                analytics.track('Traffic - Projects Tab');
              }}
              className='cursor-pointer'
            >
              <a
                className={`${
                  props.currentPage === 'projects'
                    ? ' border-b-2 border-[#4F46E5] text-[#4F46E5] font-medium'
                    : 'font-normal text-zinc-400 hover:text-zinc-600'
                } -mb-[2px] py-3 flex gap-1`}
              >
                Projects
              </a>
            </div>
            <div
              onClick={() => {
                props.navigateTabs('timeoffs');
                analytics.track('Traffic - Time off Tab');
              }}
              className='cursor-pointer'
            >
              <a
                className={`${
                  props.currentPage === 'timeoffs'
                    ? ' border-b-2 border-[#4F46E5] text-[#4F46E5] font-medium'
                    : 'font-normal text-zinc-400 hover:text-zinc-600'
                } -mb-[2px] py-3 flex gap-1`}
              >
                Time off
              </a>
            </div>
          </nav>
        </div>
      )}
      {props.children}
    </>
  );
};

export default TrafficWrapper;
