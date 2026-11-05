import {
  DiffRow,
  HeaderCols,
  Invoices,
  Quarters,
  TargetRow,
  ProjectDataTransposed,
  PipelineTargetData,
  Currency,
  Permission,
} from 'types';

export type Props = {
  quarters: Quarters;
  headerCols: HeaderCols;
  footerRow?: number;
  rowNum: number;
  isFooter: boolean;
  year: number;
  isLoading: boolean;
  currency: Currency;
  permissions: Permission[];
  submitTargetData: (data: PipelineTargetData) => Promise<void>;
  setInvoices?: (invoices: Invoices['invoices']) => void;
} & (
  | { targetAndDiff: TargetRow | DiffRow; project?: never }
  | {
      project: ProjectDataTransposed;
      targetAndDiff?: never;
    }
);
