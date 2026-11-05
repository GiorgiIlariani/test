import { ShadcnTableCell } from 'components';
import { getCurrencySymbol } from 'helpers';
import type { InvoiceTotalCellProps } from './types';

const InvoiceTotalCell = ({ invoice, currency }: InvoiceTotalCellProps) => {
  const total = invoice.total_to_be_paid?.[currency];

  return (
    <ShadcnTableCell className='font-bold text-right'>
      {total == null ? (
        '—'
      ) : (
        <>
          {getCurrencySymbol(currency)}
          {Math.round(total).toLocaleString()}
        </>
      )}
    </ShadcnTableCell>
  );
};

export default InvoiceTotalCell;
