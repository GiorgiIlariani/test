import { allowOnlyNumbersInInput } from 'helpers';
import { InputWithFollowingSignAtEnd, InputWithRightText } from 'components';
import React from 'react';
import { Props } from './types';
import { useDiscountSection } from './useDiscountSection';

const DiscountSection: React.FC<Props> = (props) => {
  const { discount, discountDuration, date, startDate, getValues, setValue } = useDiscountSection();

  const durationDate =
    +discountDuration && +discount
      ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + +discountDuration * 30 - 1)
      : undefined;

  return (
    <div className={`flex w-150 space-x-6 ${props.extraWrapperClasses}`}>
      <label className='relative  flex w-full flex-col'>
        <span
          className={`${
            props.isInShowMode ? 'text-zinc-400' : 'text-slate-900'
          } mb-2 block text-left text-sm font-medium`}
        >
          Discount amount
        </span>
        {props.loading ? (
          <div className='w-full h-9 bg-gray-300 animate-pulse rounded-md'></div>
        ) : props.isInShowMode && !discount ? (
          <p className=''>-</p>
        ) : props.isInShowMode ? (
          <div>{discount} %</div>
        ) : (
          <div className='w-full'>
            <InputWithFollowingSignAtEnd
              renderError
              blurEvent={(e) => {
                const value = e.currentTarget.value;
                if (!value) {
                  return;
                }
                if (value.startsWith('0')) {
                  e.currentTarget.value = value.replace('0', '');
                }
                if (+value > 100) {
                  e.currentTarget.value = '100';
                }
                if (+value <= 0) {
                  e.currentTarget.value = '0';
                }
              }}
              registerOptions={{
                required: {
                  message: 'Discount is required',
                  value: !!discountDuration,
                },
                onChange(event) {
                  setValue('discount_percentage', +event.target.value);
                },
              }}
              placeholder='0.00'
              inputName='discount'
              className={`${
                props.isInShowMode
                  ? 'border-none bg-transparent'
                  : 'border border-gray-300 bg-white px-3'
              } hide-number-arrows h-9 w-full rounded-md py-1.5! focus-within:border-none focus-within:ring-1 focus-within:ring-indigo-600`}
              sign='%'
              isInShowMode={props.isInShowMode}
              allowFloats
              max={100}
            />
          </div>
        )}
      </label>
      {!props.removeDuration ? (
        <div className='flex w-full flex-col'>
          {props.isInShowMode ? (
            <>
              <span className='mb-3 block text-sm font-medium text-zinc-400'>Duration</span>
              {!getValues('discount_duration') ? (
                <p>-</p>
              ) : (
                <div className='text-base'>{`${discountDuration} ${
                  discountDuration === 1 || discountDuration === 0 ? 'month' : 'months'
                }`}</div>
              )}
            </>
          ) : (
            <>
              <InputWithRightText
                inputName='discount_duration'
                placeholder='Duration'
                label='Duration'
                rightText='Month(s)'
                type='number'
                externalKeyDownHandler={allowOnlyNumbersInInput}
                registerOptions={{
                  required: {
                    message: 'Duration is required',
                    value: !!discount,
                  },
                }}
                extraMessageBlock={
                  durationDate && startDate ? (
                    <span className='h-6 text-sm text-zinc-400'>
                      {`valid until ${durationDate.getDate()}.${
                        (durationDate.getMonth() + 1).toString().length === 1
                          ? `0${durationDate.getMonth() + 1}`
                          : durationDate.getMonth() + 1
                      }.${durationDate.getFullYear()}`}
                    </span>
                  ) : null
                }
                className='hide-number-arrows px-3 py-1.5'
                labelClasses='text-slate-900! w-full'
              />
            </>
          )}
        </div>
      ) : (
        <div className='w-full' />
      )}
    </div>
  );
};

export default DiscountSection;
