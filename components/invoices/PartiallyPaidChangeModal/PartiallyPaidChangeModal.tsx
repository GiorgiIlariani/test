import { Backdrop, Loader } from 'components/shared';
import { Props } from './types';
import React from 'react';
import { X } from 'components/icons';
import { allowOnlyNumbersInInputWithDot, formatCurrencyInput, getCurrencySymbol } from 'helpers';
import { useFormContext } from 'react-hook-form';

const PartiallyPaidChangeModal: React.FC<Props> = (props) => {
  const { register, setValue, getValues } = useFormContext();

  return (
    <div className='h-screen z-999 fixed top-0 left-0 w-screen flex  justify-center items-center'>
      <Backdrop extraClasses='bg-slate-900/16!' onClick={props.closeHandler} />
      <div className='w-[25rem] rounded-md bg-white z-10'>
        <div className='p-4 text-slate-900 flex items-center justify-between'>
          <span className='font-bold'>Partially paid</span>
          <button onClick={props.closeHandler} className='hover:bg-gray-200 p-1 rounded-full'>
            <X />
          </button>
        </div>
        <label htmlFor='partially_paid_amount' className='text-sm relative px-4 block mb-6'>
          <span>Paid amount</span>
          <input
            type='text'
            {...register('partially_paid_amount', {
              onChange(e) {
                setValue('partially_paid_amount', formatCurrencyInput(e));
              },
            })}
            className='relative block rounded-md border border-zinc-200 placeholder:text-zinc-400 pl-6 w-full'
            placeholder='Enter paid amount'
            onKeyDown={(e) => {
              allowOnlyNumbersInInputWithDot(e);
            }}
          />
          <span className='absolute top-3 translate-y-full left-7'>
            {getCurrencySymbol(getValues('currency'))}
          </span>
        </label>
        <div className='py-3 px-4 flex border-t border-gray-100 justify-end items-center space-x-4'>
          <button
            type='button'
            onClick={props.closeHandler}
            className='text-slate-900 border border-zinc-200 bg-white transition-colors rounded-md hover:bg-gray-200 py-1.5 px-3'
          >
            Cancel
          </button>

          <div className='flex items-center justify-center'>
            {' '}
            <button
              type='button'
              onClick={props.changeStatusSubmitHandler}
              disabled={props.changeStatusLoading}
              className='flex items-center gap-2 indigo-600-button w-full px-6'
            >
              Submit
              {!props.changeStatusLoading || <Loader size='16px' border='2px' />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartiallyPaidChangeModal;
