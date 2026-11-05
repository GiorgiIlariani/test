import { ShadcnTableCell } from 'components';
import { getCurrencySymbol } from 'helpers';
import type { InvoiceFreeCellProps } from './types';

const InvoiceFreeCell = ({ invoice, currency }: InvoiceFreeCellProps) => {
  return (
    <ShadcnTableCell className='text-right'>
      {+invoice.free_of_charge?.[currency] === 0 ? (
        '—'
      ) : (
        <span className='text-success'>
          {getCurrencySymbol(currency ?? 'USD')}
          {Math.round(+invoice?.free_of_charge[currency]).toLocaleString()}
        </span>
      )}
    </ShadcnTableCell>
  );
};

export default InvoiceFreeCell;
