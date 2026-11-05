import { SetState, StaffMinimalEmployee, TRateCard, TimeSheetForm } from 'types';

export type Props = {
  isLoading: boolean;
  data: TimeSheetForm;
  roleList: TRateCard[];
  employees: StaffMinimalEmployee[];
  loadingRows?: boolean;
  inputName: string;
  i: number;
  selectedTerm: { week: number; date: string };
  onSubmit: (data?: { terms: TimeSheetForm[] }) => void;
  setIsFormDirty: SetState<boolean>;
  getModalData: () => void;
};
