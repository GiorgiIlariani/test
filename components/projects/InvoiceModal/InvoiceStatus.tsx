import { UseFormReturn } from 'react-hook-form';
import { Invoice, InvoiceTypes, PaidStatus } from 'types';
import { getCurrencySymbol, getPaidTagColors } from 'helpers';
import { AlertTriangle } from 'components/icons';

const invoiceStatus = (props: {
  loading?: boolean;
  form: UseFormReturn<Invoice>;
  type: InvoiceTypes;
  paidStatus: PaidStatus;
  formatter: Intl.NumberFormat;
  partiallyPaidAmount: number;
}) => (
  <>
    {props.loading ? (
      <div className='h-5 bg-gray-300 animate-pulse rounded-md w-44' />
    ) : (
      <div className='flex items-center space-x-4 text-slate-900 font-bold text-xl'>
        {props.type !== 'contract asset' && props.form.getValues('approval_status') === 'a' && (
          <span
            style={{
              ...getPaidTagColors(props.paidStatus),
            }}
            className='py-0.5 px-1.5 text-xs rounded-2xl'
          >
            {props.paidStatus === 'pp' ? (
              <span className=' flex space-x-1 items-center'>
                <span>Partially paid -</span>
                <span className='flex items-center'>
                  {getCurrencySymbol(props.form.getValues('currency'))}
                  {props.partiallyPaidAmount! as number}
                </span>
              </span>
            ) : props.paidStatus === 'p' ? (
              'Paid'
            ) : (
              'Not paid'
            )}
          </span>
        )}
        {props.form.getValues('deleted') && (
          <div className='group cursor-pointer before:hidden hover:before:block before:absolute before:contents-[""] before:w-2 before:h-2 before:rotate-45 before:top-2 before:-translate-y-[30%] before:translate-x-[200%] before:right-[20%] before:bg-red-50 relative'>
            <AlertTriangle className='w-4' pathClassName='stroke-red-600' />
            <span className='py-0.5 hidden group-hover:block absolute whitespace-nowrap px-1.5 -translate-y-[38%] translate-x-[108%] right-[20%] top-2  bg-red-50 text-red-600 text-xs rounded-md'>
              Project was deleted
            </span>
          </div>
        )}
      </div>
    )}
  </>
);

export default invoiceStatus;
