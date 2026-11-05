import { PipelineTargetData, Delta, Invoices, Quarter, Currency, Permission } from 'types';

export type Props = {
  footerRow: number;
  rowNum: number;
  isFooter: boolean;
  submitTargetData?: (data: PipelineTargetData) => Promise<void>;
  isCellEditable?: boolean;
  data?: PipelineTargetData;
  forecast: number;
  actual: number;
  delta?: Delta;
  className?: string;
  value?: number;
  toggleDeltaHover: (n?: number) => void;
  children?: React.ReactNode;
  isDiff?: boolean;
  setInvoices?: (invoices: Invoices['invoices']) => void;
  invoices?: Invoices['invoices'];
  isTotal?: boolean;
  isLoading?: boolean;
  quarters: { [key in Quarter]: boolean };
  currency: Currency;
  permissions: Permission[];
};
