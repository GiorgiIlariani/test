import {
  ControlledSelect,
  ShadcnTableCell,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components';
import { can, convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { InfoIcon } from 'lucide-react';
import { getStatusSelectClassName } from '../helpers';
import type { PaidStatus } from 'types';
import type { InvoicePaymentStatusCellProps } from './types';

const paymentStatusItems = [
  {
    label: 'Paid',
    value: 'p',
  },
  {
    label: 'Partially Paid',
    value: 'pp',
  },
  {
    label: 'Not Paid',
    value: 'np',
  },
];

const InvoicePaymentStatusCell = ({
  invoice,
  permissions,
  paymentStatusChangeHandler,
}: InvoicePaymentStatusCellProps) => {
  return (
    <ShadcnTableCell className='w-[1%]'>
      {invoice.type === 'contract asset' || invoice.approval_status !== 'a' ? (
        '—'
      ) : (
        <div className='flex items-center gap-1.5'>
          <ControlledSelect
            items={paymentStatusItems}
            value={invoice.payment_status}
            onValueChange={(value) =>
              paymentStatusChangeHandler(
                value as PaidStatus,
                invoice.id,
                invoice.currency ?? 'USD',
                invoice.payment_status,
              )
            }
            triggerClassName={getStatusSelectClassName(invoice.payment_status, 'payment')}
            contentClassName='w-max'
            align='start'
            disabled={!can('project-invoice::update-paid-status', permissions)}
            hideChevron
          />

          {invoice.payment_status === 'pp' && (
            <Tooltip>
              <TooltipTrigger
                type='button'
                aria-label='Show partially paid amount'
                className='text-muted-foreground'
              >
                <InfoIcon size={12} />
              </TooltipTrigger>

              <TooltipContent>
                Partially paid: {getCurrencySymbol(invoice.currency ?? 'USD')}
                {convertNumbersAsPrice(
                  Number(invoice.partially_paid_amount?.toString().replaceAll(',', '') ?? 0),
                )}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </ShadcnTableCell>
  );
};

export default InvoicePaymentStatusCell;
