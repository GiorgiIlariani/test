import { ShadcnTableCell, ShadcnTableFooter, ShadcnTableRow, Skeleton } from 'components';
import { getCurrencySymbol } from 'helpers';
import type { InvoiceTableFooterProps } from './types';

const projectInvoiceTotalFields = [
  'total',
  'discount_amount',
  'free_of_charge',
  'total_to_be_paid',
] as const;

const invoiceTotalFields = ['total_to_be_paid'] as const;

const InvoiceTableFooter = ({
  projectInvoices,
  calculateTotalHandler,
  currency,
  loading,
}: InvoiceTableFooterProps) => {
  const totalFields = projectInvoices ? projectInvoiceTotalFields : invoiceTotalFields;
  const columnsBeforeTotals = projectInvoices ? 3 : 5;

  return (
    <ShadcnTableFooter>
      <ShadcnTableRow>
        <ShadcnTableCell colSpan={columnsBeforeTotals} />

        {totalFields.map((field) => (
          <ShadcnTableCell key={field} className='font-bold text-right text-xs'>
            {loading ? (
              <Skeleton className='h-4 w-full bg-muted-foreground/10' />
            ) : (
              <>
                {getCurrencySymbol(currency)}
                {calculateTotalHandler(field)}
              </>
            )}
          </ShadcnTableCell>
        ))}

        <ShadcnTableCell colSpan={4} />
      </ShadcnTableRow>
    </ShadcnTableFooter>
  );
};

export default InvoiceTableFooter;
