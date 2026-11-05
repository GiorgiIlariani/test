import { FilterOptions, InvoiceList, SelectedInvoices, SetState } from 'types';

export type InvoiceTableHeaderItem = {
  label: string;
  align?: 'left' | 'right';
};

export type InvoiceTableHeaderProps = {
  headers: InvoiceTableHeaderItem[];
  invoiceData: InvoiceList[];
  selectedInvoices: SelectedInvoices[];
  setSelectedInvoices: SetState<SelectedInvoices[]>;
  selectAllInvoicesHandler: (checked: boolean) => void;
  totalInvoices: number | undefined;
  projectId?: string;
  filterOptions?: FilterOptions[];
  loading: boolean;
};
