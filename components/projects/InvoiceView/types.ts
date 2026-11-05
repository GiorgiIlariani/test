import { Dispatch, SetStateAction } from 'react';
import { InvoiceList, Permission, SetState, StaffMinimalEmployee } from 'types';

export type Props = {
  setIsOpen: SetState<number | undefined>;
  permissions: Permission[];
  employees: StaffMinimalEmployee[];
  employeesWithArchived: StaffMinimalEmployee[];
  isOpen: number;
  updateInvoicesList?: (page?: string) => Promise<void>;
  viewMode?: boolean;
  setInvoiceData: SetState<InvoiceList[]>;
  setInvoiceUpdated: Dispatch<SetStateAction<boolean>>;
};
