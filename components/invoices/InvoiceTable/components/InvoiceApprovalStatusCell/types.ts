import type { ApprovalStatus, InvoiceList, Permission } from 'types';

export type InvoiceApprovalStatusCellProps = {
  invoice: InvoiceList;
  permissions: Permission[];
  approvalStatusChangeHandler: (
    status: ApprovalStatus,
    invoiceId: number,
    previousStatus: ApprovalStatus,
  ) => Promise<void>;
};
