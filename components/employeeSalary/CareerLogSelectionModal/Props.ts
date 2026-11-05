import { ActionTypes, CareerHistory, ShowPageEmployee } from 'types';
import { CellData, SalaryViewType } from 'types/SalaryReport';

export type Props = {
  onClose: () => void;
  onAddLogClick: () => void;
  onEditLogClick: (logType: ActionTypes, id: number) => void;
  cellData: CellData | null;
  viewType: SalaryViewType;
  selectedEmployee: ShowPageEmployee | undefined;
  careerLog: CareerHistory[];
  isLoading: boolean;
};
