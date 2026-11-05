import { FilterOptions, InvoiceDashboard, SetState } from 'types';

export type Props = {
  totalInvoices: number;
  numberOfInvoicesPerPage: number;
  refetchInvoices: (
    filterOptionsArg: FilterOptions[] | undefined,
    page?: number,
    perPage?: number,
  ) => Promise<InvoiceDashboard | undefined>;
  currentPage?: number;
  setCurrentPage?: SetState<number>;
  loading: boolean;
  refetchProjectInvoices?: (
    page: number,
    per_page: number,
  ) => Promise<InvoiceDashboard | undefined>;
  isInvoicePage?: boolean;
};
