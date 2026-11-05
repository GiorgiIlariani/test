import { VacationsArray, VacationStatus } from 'types';

export type Props = {
  rejectedIsLoading: boolean;
  isRejected: boolean;
  userId: number;
  currentVacation: VacationsArray;
  reviewing: boolean;
  rejectVacations: () => void;
  approveIsLoading: boolean;
  isApproved: boolean;
  approveVacations: () => void;
  modalType: VacationStatus;
};
