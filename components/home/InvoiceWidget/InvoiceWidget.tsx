import React from 'react';
import { Props } from './types';
import { BasicSelect } from 'components/shared';
import { FormProvider } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { Arrow } from 'components/icons';
import FolderOpen from 'components/icons/FolderOpen';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { formatDateForDashboard } from '../UpcomingWidget/helpers';
import { useInvoiceWidget } from './useInvoiceWidget';
import BigArrowLeft from 'components/icons/BigArrowLeft';
import { ListWidgetSkeleton } from 'components';

const InvoiceWidget: React.FC<Props> = (props) => {
  const { form, router, total, filteredInvoices, redirectToInvoiceWithFilter } = useInvoiceWidget(
    props.currency,
    props.invoices,
  );

  return (
    <FormProvider {...form}>
      <form className='w-full border rounded-md text-slate-900 shadow-xs bg-white'>
        <div className='flex items-center justify-between gap-2 p-4 sm:p-6 border-b border-gray-100'>
          <h2
            onClick={redirectToInvoiceWithFilter}
            className='font-bold text-xl cursor-pointer flex gap-1 w-fit items-center rounded-md hover:bg-gray-100 hover:px-2 shrink-0 transition-all group'
          >
            Unpaid invoices
            <span className='opacity-0 group-hover:opacity-100 transition-opacity'>
              <BigArrowLeft />
            </span>
          </h2>

          <BasicSelect
            inputName='invoice'
            placeholder={form.getValues('invoice')}
            list={['All', 'Overdue', 'Upcoming', 'Partially paid']}
            className='w-full max-w-30'
            inputClassName='text-base xmd:text-xs focus:ring-0 focus:outline-hidden bg-gray-50 truncate w-full max-w-30 pr-7! h-7'
            dropDownStyles='top-7! left-auto! right-0! w-30'
            dropDownItemStyles='text-sm xmd:text-xs'
            removeErrorMessage
            noSearch
          />
        </div>

        <div className='h-100 flex flex-col'>
          <div className='grow overflow-auto'>
            {(props.isLoading || props.isWidgetLoading) && <ListWidgetSkeleton />}

            {!(props.isLoading || props.isWidgetLoading) && !filteredInvoices?.length && (
              <p className='flex justify-center items-center h-full text-zinc-300'>
                No Unpaid Invoices
              </p>
            )}

            {!(props.isLoading || props.isWidgetLoading) &&
              filteredInvoices
                ?.sort((a, b) => (new Date(a.invoice_date) < new Date(b.invoice_date) ? 1 : -1))
                ?.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={twMerge(
                      'border-b last:border-b-0 border-gray-100 py-2.5 px-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors group',
                    )}
                    onClick={() =>
                      router.push(
                        `/projects/${invoice?.project_id}/invoices?invoice_id=${invoice.id}`,
                      )
                    }
                  >
                    <div className='flex justify-between items-center gap-2'>
                      <div className='flex gap-2 items-center m-0 p-0'>
                        <FolderOpen />
                        <p className='text-xs'>
                          <span className='font-bold'>{invoice.project_title} </span>
                          <span>{invoice.generated_id}</span>
                        </p>
                      </div>
                      <p className='flex items-center gap-1'>
                        <span
                          className={twMerge(
                            'uppercase text-[#DC2626] text-[8px] font-medium',
                            invoice.status === 'partially paid' && 'text-[#EFA516]',
                            invoice.status === 'upcoming' && 'text-[#5A636F]',
                          )}
                        >
                          {invoice.status}
                        </span>{' '}
                        <span className='text-xs font-bold'>
                          {getCurrencySymbol(props.currency)}
                          {convertNumbersAsPrice(invoice.total[props.currency])}
                        </span>
                      </p>
                    </div>
                    <div className='flex mt-1 justify-end'>
                      <div className='flex items-center gap-1'>
                        <p className='text-[#5A636F] text-2xs'>
                          {formatDateForDashboard(invoice.overdue_date)}
                        </p>

                        <span className='rotate-180 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all'>
                          <Arrow width='12' height='12' />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <footer className='bg-gray-50 p-4 sm:p-6 border-t rounded-b-md'>
            <div className='flex justify-between items-center'>
              <p className='font-medium text-sm'>Total receivable</p>
              {props.isLoading || props.isWidgetLoading ? (
                <div className='h-6 w-20 bg-gray-200 rounded-md animate-pulse' />
              ) : (
                <p className='font-bold text-2xl'>
                  {getCurrencySymbol(props.currency)}
                  {convertNumbersAsPrice(total ?? 0)}
                </p>
              )}
            </div>
          </footer>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvoiceWidget;
