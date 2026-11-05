import { formatCurrency, formatNumber, getCurrencySymbol } from 'helpers';
import { useTotals } from './useTotals';
import { Props } from './types';

const Totals: React.FC<Props> = (props) => {
  const { currency, discount, freeOfCharge, subTotal, totalToBePaid, vat, surcharge } = useTotals(
    props.form,
  );
  return (
    <div className='mt-4 w-100 text-sm'>
      <div className='flex w-full items-center justify-between px-2 py-4'>
        <span className='text-zinc-400'>Surcharge</span>
        <span className='flex items-center text-zinc-700'>
          {getCurrencySymbol(currency)}
          {formatNumber(formatCurrency(), surcharge)}
          <input {...props.form?.register('surcharge_amount')} hidden />
        </span>
      </div>
      <div className='flex w-full items-center justify-between px-2 py-4'>
        <span className='text-zinc-400'>Subtotal</span>
        <span className='flex items-center text-zinc-700'>
          {getCurrencySymbol(currency)}
          {formatNumber(formatCurrency(), subTotal)}
          <input {...props.form?.register('subtotal')} hidden />
        </span>
      </div>

      {!props.hideFreeOfCharge && (
        <div className='flex w-full items-center justify-between px-2 py-4 border-b border-gray-100 text-[#394049]'>
          <span className='text-zinc-400'>Free of charge</span>

          <span className='flex items-center'>
            {getCurrencySymbol(currency)}
            {formatNumber(formatCurrency(), freeOfCharge)}
            <input {...props.form?.register('free_of_charge')} hidden />
          </span>
        </div>
      )}

      <div className='flex w-full items-center justify-between px-2 py-4'>
        <span className='text-zinc-400'>Discount</span>

        <span className='flex items-center'>
          {getCurrencySymbol(currency)}
          {formatNumber(formatCurrency(), discount)}
          <input {...props.form?.register('discount_amount')} hidden />
        </span>
      </div>

      {!props.hideVAT && (
        <div className='flex w-full items-center justify-between px-2 py-4 border-b border-gray-100 text-[#394049]'>
          <span className='text-zinc-400'>VAT</span>

          <span className='flex items-center'>
            {getCurrencySymbol(currency)}
            {formatNumber(formatCurrency(), vat)}
            <input {...props.form?.register('vat_amount')} hidden />
          </span>
        </div>
      )}

      <div className='flex w-full items-center justify-between px-2 py-4 text-zinc-700'>
        <span className='text-zinc-400'>Total</span>

        <div className='flex items-center justify-end space-x-1'>
          {freeOfCharge || discount ? (
            <span className='flex items-center text-xs text-zinc-400 line-through'>
              {getCurrencySymbol(currency)}
              {formatNumber(formatCurrency(), subTotal)}
            </span>
          ) : null}
          <span className='flex items-center'>
            {getCurrencySymbol(currency)}
            {formatNumber(formatCurrency(), totalToBePaid)}
            <input {...props.form?.register('total_to_be_paid')} hidden />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Totals;
