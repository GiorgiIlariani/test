import { SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  EmployeeVacations,
  Permission,
  SetState,
  VacationsArray,
  VacationsReview,
  VacationStatus,
} from 'types';

export type Props = {
  reviewing: boolean;
  canNotEdit: boolean;
  modalType: VacationStatus;
  setModalType: SetState<VacationStatus | undefined>;
  userCanReviewDelete: boolean;
  currentVacation: VacationsArray;
  currentVacationInfo: {
    sum: number;
    currentIndex: number;
  };
  userId: number;
  rejectingDelete: boolean;
  handleDeleteReview: (rejected: boolean) => void;
  permissions: Permission[];
  cancelEditingHandler: () => void;
  setCanNotEdit: SetState<boolean>;
  setReviewing: SetState<boolean>;
  editingIsLoading: boolean;
  previousVacationModalData: () => void;
  vacationData: VacationsArray[];
  nextVacationModalData: () => void;
  resetReviewingAndCanNotEdit: (newVacation: VacationsArray) => void;
  updateVacations: () => void;
  setVacationData: (value: SetStateAction<VacationsArray[]>) => void;
  submitHandler: (data: VacationsReview) => Promise<void>;
  setVacations: SetState<EmployeeVacations[]>;
  form: UseFormReturn<VacationsReview, any, undefined>;
};
