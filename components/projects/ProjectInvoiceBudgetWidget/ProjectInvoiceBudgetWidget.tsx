import { Props } from './types';
import React from 'react';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { useProjectInvoiceBudgetWidget } from './useProjectInvoiceBudgetWidget';

const ProjectInvoiceBudgetWidget: React.FC<Props> = (props) => {
  const { chartRef, isLoading } = useProjectInvoiceBudgetWidget(
    props.invoiceInfo,
    props.isWidgetLoading,
    props.projectIsLoading,
  );

  return (
    <section className='w-1/2 border border-zinc-200 rounded-md p-6 text-slate-900 shadow-xs bg-white mt-6 px-6 pt-4.5 pb-7 h-fit'>
      <h1 className='font-bold text-xl'>Invoices</h1>
      <section className='mt-4.5 border border-gray-100 px-5 py-11 flex gap-6'>
        {isLoading ? (
          <>
            <div className='relative w-[50%] h-full flex items-center justify-center'>
              <div className='w-40 h-40 bg-gray-200 rounded-full animate-pulse'></div>
            </div>
            <div className='py-5'>
              <div className='mb-5.5'>
                <div className='h-2 w-24 bg-gray-200 rounded-md animate-pulse mb-2'></div>
                <div className='h-2 w-32 bg-gray-200 rounded-md animate-pulse'></div>
              </div>
              <div>
                <div className='h-2 w-24 bg-gray-200 rounded-md animate-pulse mb-2'></div>
                <div className='h-2 w-32 bg-gray-200 rounded-md animate-pulse'></div>
                <div className='h-2 w-32 bg-gray-200 rounded-md animate-pulse mt-1'></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='relative w-[50%] h-full flex items-center justify-center'>
              <div
                ref={chartRef}
                style={{ width: '100%', height: '160px', margin: '0', padding: '0' }}
                className='cursor-default!'
              ></div>
              <div className='absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-11 h-11 cursor-default'>
                <span className='text-base font-bold'>
                  {getCurrencySymbol(props.currency)}
                  {convertNumbersAsPrice(props.invoiceInfo?.total ?? 0)}
                </span>
                <span className='text-sm text-zinc-700'>Total</span>
              </div>
            </div>
            <div className='py-5'>
              <h3 className='uppercase text-[#030229] text-2xs mb-1.5'>Received</h3>
              <div className='flex items-center mb-5.5'>
                <span className='w-[14px] h-[14px] bg-indigo-600 rounded-full mr-1'></span>{' '}
                <span className='text-xs text-[#030229]'>
                  Paid amount{' '}
                  <span className='font-bold'>
                    {' '}
                    {getCurrencySymbol(props.currency)}
                    {convertNumbersAsPrice(props.invoiceInfo?.paid_amount ?? 0)}
                  </span>
                </span>
              </div>
              <h3 className='uppercase text-[#030229] text-2xs mb-1.5'>To be received</h3>
              <div className='flex items-center'>
                <span className='w-[14px] h-[14px] bg-[#EFA516] rounded-full mr-1'></span>{' '}
                <span className='text-xs text-[#030229]'>
                  Invoiced not paid{' '}
                  <span className='font-bold'>
                    {' '}
                    {getCurrencySymbol(props.currency)}
                    {convertNumbersAsPrice(props.invoiceInfo?.invoice_not_paid ?? 0)}
                  </span>
                </span>
              </div>
              <div className='flex items-center mt-3'>
                <span className='w-[14px] h-[14px] bg-[#EFA51633] rounded-full mr-1'></span>{' '}
                <span className='text-xs text-[#030229]'>
                  Not yet invoiced{' '}
                  <span className='font-bold'>
                    {' '}
                    {getCurrencySymbol(props.currency)}
                    {convertNumbersAsPrice(props.invoiceInfo?.not_invoiced ?? 0)}
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </section>
    </section>
  );
};

export default ProjectInvoiceBudgetWidget;
