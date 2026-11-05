import { Props } from './types';
import React from 'react';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { twMerge } from 'tailwind-merge';

const ProgressHoverModal: React.FC<Props> = (props) => {
  const currencySymbol = getCurrencySymbol(props.currency);
  const totalRevenue = props.project?.total_revenue?.[props.currency] ?? 0;
  const toBeReleased = props.project?.to_be_released?.[props.currency] ?? 0;
  const released = props.project?.released?.[props.currency] ?? 0;

  const toBeReleasedPercent = totalRevenue ? Math.round((toBeReleased / totalRevenue) * 100) : 0;

  const releasedPercent = totalRevenue ? Math.round((released / totalRevenue) * 100) : 0;

  return (
    <div
      className={
        props.isNotHover
          ? 'w-full rounded-xl text-slate-900 shadow-xs border border-zinc-200 bg-white p-6 text-base relative'
          : 'w-[19.063rem] h-[12.438rem] rounded-md bg-white border border-zinc-200 p-[1.125rem] text-slate-900 absolute top-10 left-0 z-50'
      }
    >
      <h4 className={twMerge('font-semibold', props.isNotHover && 'text-lg mb-4')}>
        Project Revenue
      </h4>
      <div className={twMerge('flex flex-col gap-1', props.isNotHover && 'gap-6')}>
        <div className='flex flex-col gap-2'>
          <p
            className={twMerge('uppercase text-[8px] font-medium', props.isNotHover && 'text-2xs')}
          >
            Total Revenue
          </p>
          <p className={twMerge('text-sm', props.isNotHover && 'text-lg')}>
            {props.loading ? (
              <span className='h-6 bg-gray-200 animate-pulse rounded-sm w-1/3 inline-block' />
            ) : (
              `${currencySymbol} ${convertNumbersAsPrice(totalRevenue)}`
            )}
          </p>
        </div>

        <div className={twMerge('flex flex-col gap-1', props.isNotHover && 'gap-6')}>
          <p
            className={twMerge(
              'uppercase text-[8px] font-medium text-[#EFA516]',
              props.isNotHover && 'text-2xs',
            )}
          >
            Upcoming Contracted Revenue
          </p>
          <p className={twMerge('text-sm', props.isNotHover && 'text-lg')}>
            {props.loading ? (
              <span className='h-6 bg-gray-200 animate-pulse rounded-sm w-2/3 inline-block' />
            ) : (
              `${currencySymbol} ${convertNumbersAsPrice(toBeReleased)} (${toBeReleasedPercent}%)`
            )}
          </p>
        </div>

        <div className={twMerge('flex flex-col gap-1', props.isNotHover && 'gap-6')}>
          <p
            className={twMerge(
              'uppercase text-[8px] font-medium text-[#059669]',
              props.isNotHover && 'text-2xs',
            )}
          >
            Realized Revenue
          </p>
          <p className={twMerge('text-sm', props.isNotHover && 'text-lg')}>
            {props.loading ? (
              <span className='h-6 bg-gray-200 animate-pulse rounded-sm w-2/3 inline-block' />
            ) : (
              `${currencySymbol} ${convertNumbersAsPrice(released)} (${releasedPercent}%)`
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressHoverModal;
