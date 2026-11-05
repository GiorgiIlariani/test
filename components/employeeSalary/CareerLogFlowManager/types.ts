import { CellData, SalaryViewType } from 'types/SalaryReport';

export type CareerLogFlowView = 'selection' | 'add' | 'edit';

export type Props = {
  onClose: () => void;
  cellData: CellData | null;
  viewType: SalaryViewType;
  refetchReport: () => void;
};
