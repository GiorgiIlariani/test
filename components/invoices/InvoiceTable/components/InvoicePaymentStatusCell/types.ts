import type { Currency, InvoiceList, PaidStatus, Permission } from 'types';

export type InvoicePaymentStatusCellProps = {
  invoice: InvoiceList;
  permissions: Permission[];
  paymentStatusChangeHandler: (
    status: PaidStatus,
    invoiceId: number,
    currency: Currency,
    previousStatus: PaidStatus,
  ) => Promise<void>;
};
