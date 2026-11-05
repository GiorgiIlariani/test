import { Dispatch, SetStateAction } from 'react';
import {
  ApprovalStatus,
  Currency,
  FilterOptions,
  InvoiceDashboard,
  InvoiceList,
  PaidStatus,
  Permission,
  SelectedInvoices,
  SetState,
  StaffMinimalEmployee,
} from 'types';

export type Props = {
  calculateTotalHandler: (
    mount: 'total' | 'discount_amount' | 'free_of_charge' | 'total_to_be_paid',
  ) => string;
  selectInvoiceHandler: (
    length: number,
    i: number,
    status: ApprovalStatus,
    paid_status: PaidStatus,
    checked: boolean,
  ) => void;
  selectedInvoices: SelectedInvoices[];
  selectAllInvoicesHandler: (checked: boolean) => void;
  invoiceData: InvoiceList[];
  openPartiallyPaidHandler: (arg0: number, arg1: Currency) => void;
  totalInvoices: number | undefined;
  projectInvoices: boolean;
  projectId?: string;
  employees: StaffMinimalEmployee[];
  employeesWithArchived: StaffMinimalEmployee[];
  permissions: Permission[];
  setSelectedInvoices: SetState<SelectedInvoices[]>;
  setInvoiceData: SetState<InvoiceList[]>;
  numberOfInvoicesPerPage: number;
  loading: boolean;
  refetchInvoices?: (
    filterOptionsArg?: FilterOptions[],
    page?: number,
    pages?: number,
  ) => Promise<InvoiceDashboard | undefined>;
  currentPage?: number;
  setCurrentPage?: SetState<number>;
  filterOptions?: FilterOptions[];
  refetchProjectInvoices?: (
    page: number,
    per_page: number,
  ) => Promise<InvoiceDashboard | undefined>;
  isInvoicePage?: boolean;
  currency: Currency;
  setInvoiceUpdated: Dispatch<SetStateAction<boolean>>;
};
