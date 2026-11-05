import { convertNumbersAsPrice, getCurrencySymbol, getFormattedDate } from 'helpers';
import React, { useContext } from 'react';
import { Currency } from 'types';
import { Props } from './types';
import { GlobalApiInfo } from 'context';

const CareerLogHeader: React.FC<Props> = (props) => {
  const { applicationConfigs } = useContext(GlobalApiInfo);

  return (
    <div className='flex gap-10 text-sm border-b border-gray-100 pt-2 pl-1 pr-3 pb-6'>
      <div className='w-1/2 flex flex-col gap-12'>
        <div className='flex justify-between'>
          <h3 className='text-zinc-500'>Position</h3>
          <div className='flex flex-col items-end'>
            <p className='font-medium'>
              {props.logIsLoading ? (
                <div className='mt-1 w-36 h-4 animate-pulse rounded-md bg-gray-300' />
              ) : (
                props.headerCareerInfo.position
              )}
            </p>
            <p className='text-zinc-500'>
              {props.logIsLoading ? (
                <div className='mt-1 w-20 h-4 animate-pulse rounded-md bg-gray-300' />
              ) : props.headerCareerInfo.position ? (
                props.headerCareerInfo.positionDate?.length <= 10 ? (
                  props.headerCareerInfo.positionDate
                ) : (
                  getFormattedDate(props.headerCareerInfo.positionDate, true, true)
                )
              ) : (
                '-'
              )}
            </p>
          </div>
        </div>

        <div className='flex justify-between'>
          <h3 className='text-zinc-500'>
            Gross {props.headerCareerInfo?.salaryPaymentType} salary
          </h3>
          <div className='flex flex-col items-end'>
            {props.logIsLoading ? (
              <div className='mt-1 w-28 h-4 animate-pulse rounded-md bg-gray-300' />
            ) : props.headerCareerInfo?.salary ? (
              <div className='flex'>
                <p className={`${props.headerCareerInfo?.currency === 'GEL' && '-mt-[2px]'}`}>
                  {getCurrencySymbol(props.headerCareerInfo?.currency ?? ('USD' as Currency))}
                </p>
                <p className='font-medium'>
                  {convertNumbersAsPrice(Number(props.headerCareerInfo?.salary) ?? 0, 2)}
                </p>
              </div>
            ) : (
              '-'
            )}

            <p className='text-zinc-500'>
              {props.logIsLoading ? (
                <div className='mt-1 w-20 h-4 animate-pulse rounded-md bg-gray-300' />
              ) : props.headerCareerInfo?.salary ? (
                getFormattedDate(props.headerCareerInfo?.salaryDate, true, true)
              ) : (
                '-'
              )}
            </p>
          </div>
        </div>

        <div className='flex justify-between'>
          <h3 className='text-zinc-500'>Net {props.headerCareerInfo?.salaryPaymentType} salary</h3>
          <div className='flex flex-col items-end'>
            {props.logIsLoading ? (
              <div className='mt-1 w-28 h-4 animate-pulse rounded-md bg-gray-300' />
            ) : props.headerCareerInfo?.salary ? (
              <div className='flex'>
                <p className={`${props.headerCareerInfo?.currency === 'GEL' && '-mt-[2px]'}`}>
                  {getCurrencySymbol(props.headerCareerInfo?.currency ?? ('USD' as Currency))}
                </p>
                <p className='font-medium'>
                  {convertNumbersAsPrice(
                    Number(props.headerCareerInfo?.salary) *
                      Number(applicationConfigs.gross_to_net_multiplier),
                    2,
                  )}
                </p>
              </div>
            ) : (
              '-'
            )}

            <p className='text-zinc-500'>
              {props.logIsLoading ? (
                <div className='mt-1 w-20 h-4 animate-pulse rounded-md bg-gray-300' />
              ) : props.headerCareerInfo?.salary ? (
                getFormattedDate(props.headerCareerInfo?.salaryDate, true, true)
              ) : (
                '-'
              )}
            </p>
          </div>
        </div>
      </div>
      <div className='w-1/2 flex flex-col gap-12'>
        <div className='flex justify-between'>
          <h3 className='text-zinc-500'>Seniority</h3>
          <div className='flex flex-col items-end'>
            <p className='font-medium'>
              {props.logIsLoading ? (
                <div className='mt-1 w-36 h-4 animate-pulse rounded-md bg-gray-300' />
              ) : (
                props.headerCareerInfo?.seniority
              )}
            </p>
            <p className='text-zinc-500'>
              {props.logIsLoading ? (
                <div className='mt-1 w-20 h-4 animate-pulse rounded-md bg-gray-300' />
              ) : props.headerCareerInfo.seniority ? (
                getFormattedDate(props.headerCareerInfo?.seniorityDate, true, true)
              ) : (
                '-'
              )}
            </p>
          </div>
        </div>
        <div className='flex justify-between'>
          <h3 className='text-zinc-500'>Current projects</h3>
          <p className='font-medium text-right'>
            {props.logIsLoading ? (
              <div className='mt-1 w-36 h-4 animate-pulse rounded-md bg-gray-300' />
            ) : props.currentProjects.length !== 0 ? (
              props.currentProjects.join(', ')
            ) : (
              'Bench'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerLogHeader;
