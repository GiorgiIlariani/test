import { Currency, Permission, SelectedInvoices, SetState, StaffMinimalEmployee } from 'types';

export type Props = {
  selectedInvoices: SelectedInvoices[];
  setSelectedInvoices?: SetState<Props['selectedInvoices']>;
  closeReviewModal: () => void;
  employees: StaffMinimalEmployee[];
  employeesWithArchived: StaffMinimalEmployee[];
  updateInvoicesList?: (page?: string) => Promise<void>;
  permissions: Permission[];
  setReviewingInvoiceData?: SetState<{
    currency: Currency;
    internal_project_id: number;
    project_name: string;
  }>;
  setContractAssetIsOpen?: SetState<boolean>;
  setReviewModalIsOpen?: SetState<boolean>;
  viewMode?: boolean;
  isOpen?: boolean;
  canNotEdit?: boolean;
};
