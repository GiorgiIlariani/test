import { SetState, StaffMinimalEmployee } from 'types';

export type Props = {
  isOpen: boolean;
  setIsOpen: SetState<boolean>;
  employees: StaffMinimalEmployee[];
  selectedTerm: { week: number; date: string; realDate: string };
  projectId: number;
  getTimeSheets: () => void;
};
