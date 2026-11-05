import React from 'react';
import {
  HC_QUARTER_HEADERS,
  INCOME_HEADERS,
  PARTIAL_MONTH_NAMES,
  PARTIAL_QUARTER_NAMES,
} from 'config';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { twMerge } from 'tailwind-merge';
import { Props } from './Props';
import { HeadCountTableRow } from '../HeadCountTableRow';

const HeadCountTable: React.FC<Props> = ({
  year,
  sortingState,
  sortHeadCountReport,
  type = 'Headcount',
  headCount,
  currency = 'USD',
  loading = false,
  period = 'monthly',
}) => {
  const isMonthly = period === 'monthly';
  const periodNames = isMonthly ? PARTIAL_MONTH_NAMES : PARTIAL_QUARTER_NAMES;
  const periodHeaders = isMonthly ? INCOME_HEADERS : HC_QUARTER_HEADERS;
  const periodKey = isMonthly ? 'months' : 'quarters';
  let fullTotal = 0;

  return (
    <div className='rounded-md grow overflow-hidden'>
      <div className='overflow-auto max-h-full border-x'>
        <div className='sticky top-0 border-b-[0.5px] z-20'>
          <div
            className={twMerge(
              'w-52 inline-block text-indigo-900 text-xs sticky top-0 z-20 left-0 align-bottom rounded-tl-md border-l border-zinc-200/60 h-14 bg-indigo-50',
              period === 'quarterly' && 'w-[25%]',
            )}
          >
            <div className='items-center font-medium bg-indigo-50 h-14 inline-flex pl-12'>Name</div>
          </div>
          <div
            className={twMerge(
              'w-[calc(100%-25.77rem)] sticky top-0 h-14 align-bottom text-indigo-900 text-xs inline-grid grid-cols-income-month-cell bg-indigo-50 border-r',
              period === 'quarterly' && 'grid-cols-hc-quarter-cell w-[75%] justify-end',
            )}
          >
            {periodHeaders.map((el, i) => (
              <div
                key={el}
                className={twMerge(
                  'items-center font-medium  border-zinc-200/60 bg-indigo-50 pl-6 h-14 inline-flex cursor-pointer',
                  sortingState[period][i]?.sortedBy === 'desc' ? 'font-bold!' : '',
                )}
                onClick={() => i < periodHeaders.length - 1 && sortHeadCountReport(i)}
              >
                {el}
              </div>
            ))}
          </div>
        </div>

        <div className='sticky'>
          {loading
            ? [...Array(20)].map((_, rowIdx) => (
                <div key={rowIdx} className='w-full inline-flex animate-pulse'>
                  <div className='w-52 flex items-center justify-center text-xs sticky top-0 left-0 align-bottom rounded-tl-md border-b-[0.5px] border-zinc-200/60 h-14 bg-white'>
                    <div className='h-4 bg-gray-200 rounded-sm w-1/2'></div>
                  </div>
                  <div className='w-[calc(100%-25.77rem)] grid grid-cols-income-month-cell'>
                    {PARTIAL_MONTH_NAMES.map((_, i) => (
                      <div
                        key={i}
                        className='px-6 pt-4 border-b-[0.5px] border-zinc-200/60 text-right'
                      >
                        <div className='h-4 bg-gray-200 rounded-sm'></div>
                      </div>
                    ))}
                    <div className='pl-12 py-2 border-b-[0.5px] border-zinc-200/60 text-right font-semibold'>
                      <div className='h-4 bg-gray-200 rounded-sm w-1/2'></div>
                    </div>
                  </div>
                </div>
              ))
            : headCount?.map((position) => (
                <HeadCountTableRow
                  key={position.name}
                  year={year}
                  currency={currency}
                  hc={position}
                  period={period}
                  type={type}
                  showChevron={position.seniorities.length > 0}
                  rowType='position'
                >
                  {position.seniorities.map((seniority) => (
                    <HeadCountTableRow
                      key={seniority.name}
                      year={year}
                      currency={currency}
                      hc={seniority}
                      period={period}
                      type={type}
                      nameClasses='pl-14'
                      showChevron={
                        ('employees' in seniority && (seniority.employees?.length ?? 0) > 0) ||
                        ('children' in seniority && (seniority.children?.length ?? 0) > 0)
                      }
                      rowType='seniority'
                    >
                      {'employees' in seniority && seniority.employees
                        ? seniority.employees.map((employee) => (
                            <HeadCountTableRow
                              key={employee.name}
                              year={year}
                              currency={currency}
                              hc={employee}
                              period={period}
                              type={type}
                              nameClasses='pl-20'
                              rowType='employees'
                            />
                          ))
                        : 'children' in seniority &&
                          seniority.children &&
                          seniority.children.map((child) => (
                            <HeadCountTableRow
                              key={child.name}
                              year={year}
                              currency={currency}
                              hc={child}
                              period={period}
                              type={type}
                              nameClasses='pl-20'
                              showChevron={child.employees?.length > 0}
                              rowType='children'
                            >
                              {child.employees.map((employee) => (
                                <HeadCountTableRow
                                  key={employee.name}
                                  year={year}
                                  currency={currency}
                                  hc={employee}
                                  period={period}
                                  type={type}
                                  nameClasses='pl-24'
                                  rowType='employees'
                                />
                              ))}
                            </HeadCountTableRow>
                          ))}
                    </HeadCountTableRow>
                  ))}
                </HeadCountTableRow>
              ))}
        </div>

        <div className='sticky bottom-0 z-10 bg-indigo-50 border-b-[0.5px] border-zinc-200/60/60 flex text-indigo-900 h-14 rounded-b-md -mt-1.25'>
          <div
            className={twMerge(
              'flex w-52 border-zinc-200/60 sticky left-0 z-10 bg-indigo-50 font-bold pl-12 pt-3 rounded-bl-md text-sm',
              period === 'quarterly' && 'w-[25%] justify-end',
            )}
          >
            <div className='flex gap-1 w-full pt-px'>
              Total:{' '}
              {loading ? (
                <div className='h-4 bg-gray-300 rounded-sm animate-pulse'></div>
              ) : (
                <p>{headCount?.length}</p>
              )}
            </div>
          </div>
          <div
            className={twMerge(
              'w-[calc(100%-25rem)] grid grid-cols-income-month-cell text-xs font-semibold text-indigo-900 bg-indigo-50',
              period === 'quarterly' && 'grid-cols-hc-quarter-cell w-[75%] justify-end',
            )}
          >
            {periodNames.map((month, idx) => {
              const monthKey = isMonthly
                ? `${year}-${String(idx + 1).padStart(2, '0')}`
                : `${year}-${month}`;

              const total =
                headCount?.reduce(
                  (sum, hc) =>
                    sum +
                    (type === 'Headcount'
                      ? hc?.[periodKey]?.[monthKey]?.headcount ?? 0
                      : hc?.[periodKey]?.[monthKey]?.costs?.[currency] ?? 0),
                  0,
                ) ?? 0;

              if (type === 'Headcount') {
                if (total > fullTotal) fullTotal = total;
              } else {
                fullTotal += total;
              }

              return (
                <div key={monthKey} className='px-6 py-1 bg-indigo-50 pt-4'>
                  {loading ? (
                    <div className='h-4 bg-gray-300 rounded-sm animate-pulse'></div>
                  ) : (
                    <span>
                      {type === 'Cost' && getCurrencySymbol(currency)}
                      {convertNumbersAsPrice(total ?? 0)}
                    </span>
                  )}
                </div>
              );
            })}
            <div className='px-6 py-1 bg-indigo-50 pt-4'>
              {loading ? (
                <div className='h-4 bg-gray-300 rounded-sm animate-pulse'></div>
              ) : (
                <span>
                  {type === 'Cost' && getCurrencySymbol(currency)}
                  {convertNumbersAsPrice(fullTotal)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadCountTable;
