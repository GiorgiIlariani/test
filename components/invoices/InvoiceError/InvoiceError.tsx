import { ThinLineTrashCan, X, AlertTriangle } from 'components';
import React from 'react';
import { Props } from './types';

const InvoiceError: React.FC<Props> = (props) => {
  return (
    <div className='relative flex py-8 flex-col items-center justify-center transform rounded-lg bg-white transition-all max-w-md w-full p-6 align-top'>
      <div className='flex w-full justify-between'>
        <div className='w-1/3'></div>
        <div className='p-4 rounded-full bg-red-200'>
          {props.errorStatus === 404 ? (
            <ThinLineTrashCan className='w-20 h-20' />
          ) : (
            <AlertTriangle className='w-20 h-20' pathClassName='stroke-red-600' />
          )}
        </div>
        <button
          type='button'
          onClick={props.closeHandler}
          className='rounded-md ml-auto flex bg-white self-start mt-2 text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        >
          <X />
        </button>
      </div>
      <h1 className='text-redberry-red mt-4 text-center text-lg'>
        {props.errorStatus === 404
          ? 'We can not find this invoice in our records 😢'
          : 'Unexpected error happened please try again later and if error persists contact developers'}
      </h1>
    </div>
  );
};

export default InvoiceError;
