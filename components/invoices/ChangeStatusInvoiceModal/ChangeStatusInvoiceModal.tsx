import { AdvancedSelect, Backdrop, Loader } from 'components';
import { Props } from './types';
import React from 'react';
import { X } from 'components/icons';
import { statusChangeButtonTextRenderer } from './helpers';
import { Invoice, PaidStatus } from 'types';
import { useFormContext } from 'react-hook-form';

const ChangeStatusInvoiceModal: React.FC<Props> = (props) => {
  const { getValues } = useFormContext<Invoice>();
  return (
    <div className='h-screen fixed top-0 left-0 z-99999999999 w-screen flex items-center justify-center'>
      <Backdrop extraClasses='bg-slate-900/16!' onClick={props.closeHandler} />
      <div className='w-[25rem] z-10 rounded-md bg-white'>
        <div className='p-4 text-slate-900 flex items-center justify-between'>
          <span className='font-bold'>Status Change</span>
          <button onClick={props.closeHandler} className='hover:bg-gray-200 p-1 rounded-full'>
            <X />
          </button>
        </div>
        <div className='px-4'>
          <AdvancedSelect
            inputName={'payment_status'}
            list={[
              {
                id: 'p',
                title: 'Paid',
              },
              {
                id: 'np',
                title: 'Not paid',
              },
              {
                id: 'pp',
                title: 'Partially paid',
              },
            ]}
            noSearch={true}
            externalButtonTextRenderer={(value) =>
              statusChangeButtonTextRenderer(value as PaidStatus, props.formatter, getValues)
            }
            externalButtonClassName='top-5! left-2'
            inputClassName='border border-red-600'
            className='h-10 border rounded-md my-3'
            chevronStyles='top-7! translate-y-0!'
            dropDownStyles='top-8!'
            errorIconStyles='top-3!'
          />
        </div>
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
              disabled={props.changeStatusLoading}
              onClick={props.changeStatusSubmitHandler}
              className='py-3 px-4 flex items-center justify-center gap-2 indigo-600-button w-full'
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

export default ChangeStatusInvoiceModal;
