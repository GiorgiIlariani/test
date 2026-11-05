import { can } from 'helpers';
import { cn } from 'lib';
import { format } from 'date-fns';
import { Button, ShadcnTableCell, Tooltip, TooltipContent, TooltipTrigger } from 'components';
import { InvoiceEmailHistorySheet } from '../InvoiceEmailHistorySheet';
import { InfoIcon } from 'lucide-react';
import type { InvoiceActionsCellProps } from './types';

const formatEmailSentDate = (date: string) => format(new Date(date), 'd MMM yyyy');

const InvoiceActionsCell = ({ invoice, permissions, onOpen }: InvoiceActionsCellProps) => {
  const latestEmailStatus = invoice.latest_initial_email_event?.status;
  const emailIsPending = latestEmailStatus === 'pending';
  const latestEmailFailed = latestEmailStatus === 'failed';
  const canAccessInvoiceEmail = can('project-invoice::send-to-client', permissions);
  const canSendInvoiceEmail =
    canAccessInvoiceEmail &&
    invoice.approval_status === 'a' &&
    invoice.payment_status !== 'p' &&
    invoice.type !== 'contract asset';

  return (
    <ShadcnTableCell className='w-[1%] text-right'>
      {canAccessInvoiceEmail ? (
        <div className='inline-grid grid-cols-[1fr_1fr] items-center gap-3'>
          {canSendInvoiceEmail ? (
            <Button
              type='button'
              variant={invoice.email_sent_at ? 'outline' : 'default-outline'}
              disabled={emailIsPending}
              onClick={() => onOpen(invoice)}
            >
              {emailIsPending
                ? invoice.email_sent_at
                  ? 'Resending...'
                  : 'Sending...'
                : latestEmailFailed && !invoice.email_sent_at
                ? 'Retry'
                : invoice.email_sent_at
                ? 'Resend'
                : 'Send to client'}
            </Button>
          ) : (
            '—'
          )}

          <div className='flex items-center gap-2'>
            <InvoiceEmailHistorySheet invoice={invoice} />

            <Tooltip>
              <TooltipTrigger
                type='button'
                aria-label='Show invoice email status'
                className={cn(
                  latestEmailFailed ? 'text-destructive' : 'text-muted-foreground',
                  !invoice.email_sent_at && !latestEmailFailed && 'opacity-50',
                )}
                disabled={!invoice.email_sent_at && !latestEmailFailed}
              >
                <InfoIcon className='size-3.5' />
              </TooltipTrigger>

              <TooltipContent className='flex-col items-start gap-1 shadow-sm'>
                {invoice.email_sent_at && (
                  <p>Last sent: {formatEmailSentDate(invoice.email_sent_at)}</p>
                )}

                {latestEmailFailed && (
                  <p className='text-destructive'>
                    {invoice.email_sent_at ? 'Latest resend failed' : 'Last send failed'}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : (
        '—'
      )}
    </ShadcnTableCell>
  );
};

export default InvoiceActionsCell;
