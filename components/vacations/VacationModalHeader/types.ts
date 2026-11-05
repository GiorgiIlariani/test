import { Department, Permission, SetState, VacationsArray, VacationType } from 'types';

export type Props = {
  currentVacation: VacationsArray;
  requestType: VacationType;
  shouldActionsBeShown: boolean;
  permissions: Permission[];
  userCanSeeVacationFields: boolean | undefined;
  userCanReviewDelete: boolean;
  setCanNotEditAdditional: SetState<boolean>;
  setCanNotEditMain: SetState<boolean>;
  setReviewing: SetState<boolean>;
  reviewing: boolean;
  canNotEditAdditional: boolean;
  canNotEditMain: boolean;
  cancelEditingHandler: () => void;
  isEmployeeInBench: boolean;
  employeeMinimalData:
    | {
        id: number;
        first_name: string;
        last_name: string;
        avatar: string;
        department: Department;
      }
    | undefined;
  startDeleting: () => void;
  userId: number;
  closeModal: () => void;
};
