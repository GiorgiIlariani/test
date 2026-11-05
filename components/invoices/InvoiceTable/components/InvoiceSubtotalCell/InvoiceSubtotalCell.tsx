import { ShadcnTableCell } from 'components';
import { getCurrencySymbol } from 'helpers';
import type { InvoiceSubtotalCellProps } from './types';

const InvoiceSubtotalCell = ({ invoice, currency }: InvoiceSubtotalCellProps) => {
  return (
    <ShadcnTableCell className='text-right'>
      {getCurrencySymbol(currency ?? 'USD')}
      {Math.round(+invoice.total[currency]).toLocaleString()}
    </ShadcnTableCell>
  );
};

export default InvoiceSubtotalCell;
