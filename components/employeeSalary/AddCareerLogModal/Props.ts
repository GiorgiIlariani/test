import { CellData, SalaryViewType } from 'types/SalaryReport';

export type Props = {
  onClose: () => void;
  onBack?: () => void;
  refetchReport: () => void;
  viewType: SalaryViewType;
  cellData?: CellData | null;
};
