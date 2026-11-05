import { Dispatch, SetStateAction } from 'react';
import {
  Currency,
  FilterOptions,
  InvoiceDashboard,
  Permission,
  SetState,
  StaffMinimalEmployee,
} from 'types';

export type Props = {
  invoices?: InvoiceDashboard | undefined;
  projectInvoices: boolean;
  projectId?: number;
  permissions: Permission[];
  employees: StaffMinimalEmployee[];
  employeesWithArchived: StaffMinimalEmployee[];
  loading: boolean;
  setLoading: SetState<boolean>;
  filterOptions?: FilterOptions[];
  refreshInvoiceDashboard?: (pageIndex: string, projectId?: string | undefined) => void;
  refetchInvoices?: (
    filterOptionsArg?: FilterOptions[],
    page?: number,
    pages?: number,
  ) => Promise<InvoiceDashboard | undefined>;
  invoiceCreated?: boolean;
  setInvoiceUpdated?: Dispatch<SetStateAction<boolean>>;
  currency: Currency;
  projects?: {
    id: number;
    title: string;
    currency: Currency;
  }[];
};
