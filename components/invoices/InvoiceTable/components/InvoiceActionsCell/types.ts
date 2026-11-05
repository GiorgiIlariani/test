import type { InvoiceList, Permission } from 'types';

export type InvoiceActionsCellProps = {
  invoice: InvoiceList;
  permissions: Permission[];
  onOpen: (invoice: InvoiceList) => void;
};
