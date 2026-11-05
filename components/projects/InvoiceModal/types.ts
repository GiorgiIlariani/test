import React, { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Currency, Invoice, InvoiceTypes, Permission, SetState, StaffMinimalEmployee } from 'types';

export type Props = {
  employees: StaffMinimalEmployee[];
  employeesWithArchived: StaffMinimalEmployee[];
  setContractAssetIsOpen?: SetState<boolean>;
  reviewingInvoiceData?: {
    currency: Currency;
    internal_project_id: number | string;
    project_name: string;
  };
  permissions: Permission[];
  updateInvoicesList?: (page: string) => void;
  refreshInvoiceDashboard?: (pageIndex: string, projectId?: string | undefined) => void | undefined;
  isOpen: boolean;
  closeHandler?: () => void;
  type?: InvoiceTypes;
  id?: number;
  setInvoiceType?: SetState<InvoiceTypes>;
  setErrorStatus?: SetState<number>;
  loading?: boolean;
  setLoading?: SetState<boolean>;
  children?: React.ReactNode;
  label?: React.ReactNode;
  subHeader?: JSX.Element;
  customFooter?: JSX.Element;
  externalForm?: UseFormReturn<Invoice>;
  isInEdit?: boolean;
  setIsInEdit?: SetState<boolean>;
  hideVAT?: boolean;
  setReviewModalIsOpen?: SetState<boolean>;
  setInvoiceCreated?: SetState<boolean>;
  setInvoiceUpdated?: Dispatch<SetStateAction<boolean>>;
};
