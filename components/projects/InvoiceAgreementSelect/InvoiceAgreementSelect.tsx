import { DownChevron } from 'components';
import { CURRENCIES } from 'config';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Props } from './types';

const InvoiceAgreementSelect: React.FC<Props> = (props) => {
  const { register } = useFormContext();
  return (
    <div className='relative inline'>
      <select
        {...register(props.name)}
        disabled={props.disabled}
        className={`h-fit ${
          props.needsRightMargin ? ' mx-2' : 'mr-2'
        } focus:ring-0 focus:outline-hidden bg-none remove-arrow-from-select focus:border-transparent bg-gray-100 ${
          !props.disabled ? 'pl-2 pr-6' : 'px-2'
        } border-transparent text-slate-900 rounded-2xl p-0`}
      >
        {CURRENCIES.map((currency) => {
          return (
            <option value={currency.value} key={currency.text}>
              {currency.text}
            </option>
          );
        })}
      </select>
      {!props.disabled && (
        <div className='pointer-events-none absolute rounded-sm top-0 right-0 flex h-full -translate-x-1/2 items-center justify-center'>
          <div
            className={`pointer-events-none bg-gray-100 rounded-r-2xl py-2
            pl-0.5
           pr-2.5`}
          >
            <DownChevron className='w-2' pathFill='#999DA5' />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceAgreementSelect;
