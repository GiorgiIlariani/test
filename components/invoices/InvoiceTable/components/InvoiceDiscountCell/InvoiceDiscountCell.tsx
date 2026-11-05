import { ShadcnTableCell } from 'components';
import { getCurrencySymbol } from 'helpers';
import type { InvoiceDiscountCellProps } from './types';

const isFloat = (num: number) => {
  return Number(num) === num && num % 1 !== 0;
};

const calculateDiscountPercentage = (discount: number, total: number, freeOfCharge: number) => {
  const discountableTotal = total - freeOfCharge;

  if (discountableTotal === 0) return 0;

  const percentage = (discount / discountableTotal) * 100;

  return isFloat(percentage) ? percentage.toFixed(1) : percentage;
};

const InvoiceDiscountCell = ({ invoice, currency }: InvoiceDiscountCellProps) => {
  const discount = invoice.discount_amount?.[currency] ?? 0;
  const subtotal = invoice.total?.[currency] ?? 0;
  const freeOfCharge = invoice.free_of_charge?.[currency] ?? 0;

  return (
    <ShadcnTableCell className='text-right'>
      {discount === 0 ? (
        '—'
      ) : (
        <p className='flex items-center justify-end gap-1'>
          {calculateDiscountPercentage(discount, subtotal, freeOfCharge)}%
          <span className='text-muted-foreground text-xs'>
            ({getCurrencySymbol(currency)}
            {Math.round(discount).toLocaleString()})
          </span>
        </p>
      )}
    </ShadcnTableCell>
  );
};

export default InvoiceDiscountCell;
