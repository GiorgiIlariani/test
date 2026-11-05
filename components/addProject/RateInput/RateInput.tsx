import { formatCurrency, formatNumber, getCurrencySymbol } from 'helpers';
import React from 'react';
import { Props } from './types';
import { useRateInput } from './useRateInput';

const RateInput: React.FC<Props> = (props) => {
  const { currency, setValue, register, getValues } = useRateInput();
  return (
    <>
      {!!!props.isInShowMode ? (
        <input
          type='number'
          step={'any'}
          {...register(props.inputName)}
          id={props.inputName}
          onBlur={(e) => {
            let targetValue = e.target.value;
            if (targetValue.startsWith('0') && targetValue.length !== 1) {
              e.target.value = targetValue.slice(1);
            }
            setValue(props.inputName, +e.target.value);
          }}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          className='hide-number-arrows peer h-full w-full  border-none p-0 text-zinc-700 outline-hidden ring-0 focus:border-none focus:outline-hidden focus:ring-0'
          disabled={props.isInShowMode}
        />
      ) : (
        <p> {formatNumber(formatCurrency(), Number(getValues(props.inputName) || 0))}</p>
      )}
      <span className='text-zinc-700 peer-focus:text-zinc-700/70 mr-auto'>
        {getCurrencySymbol(currency)}
      </span>
    </>
  );
};

export default RateInput;
