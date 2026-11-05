import { ShadcnTableCell } from 'components';
import { formatDate } from 'helpers';
import { cn } from 'lib';
import type { InvoiceDateCellProps } from './types';

const getDeadlineText = (deadlineDetails: InvoiceDateCellProps['invoice']['deadline_details']) => {
  if (!deadlineDetails) return undefined;
  if (deadlineDetails.status === 'due_today') return 'due today';

  const dayLabel = deadlineDetails.days === 1 ? 'day' : 'days';
  const statusLabel = deadlineDetails.status === 'overdue' ? 'overdue' : 'left';

  return `${deadlineDetails.days} ${deadlineDetails.unit} ${dayLabel} ${statusLabel}`;
};

const InvoiceDateCell = ({ invoice }: InvoiceDateCellProps) => {
  const deadlineDetails = invoice.deadline_details;
  const deadlineText = getDeadlineText(deadlineDetails);
  const shouldShowDeadline =
    Boolean(invoice.invoice_date) &&
    invoice.approval_status === 'a' &&
    invoice.payment_status !== 'p' &&
    invoice.type !== 'contract asset';

  return (
    <ShadcnTableCell>
      <div className='flex flex-col'>
        <p>{invoice.invoice_date ? formatDate(invoice.invoice_date) : '—'}</p>

        {shouldShowDeadline && (
          <span
            className={cn(
              'text-xs text-success',
              deadlineDetails?.status === 'overdue' && 'text-destructive',
              deadlineDetails?.status === 'upcoming' && 'text-warning',
              !deadlineText && 'text-muted-foreground',
            )}
          >
            {deadlineText ?? 'Data is not available'}
          </span>
        )}
      </div>
    </ShadcnTableCell>
  );
};

export default InvoiceDateCell;
