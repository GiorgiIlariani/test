import { SetState } from 'types';

export type Props = {
  showDropdown: boolean | undefined;
  setCanNotEditAdditional: SetState<boolean>;
  setCanNotEditMain: SetState<boolean>;
  setReviewing: SetState<boolean>;
  reviewing: boolean;
  canNotEditAdditional: boolean;
  canNotEditMain: boolean;
  cancelEditingHandler: () => void;
  canUserSeeVacationFields: boolean | undefined;
  isEmployeeInBench: boolean;
  canEditBothOwnMainFieldsAndEditionalFields: boolean;
  isUserReviewer: boolean;
  isCurrentUserVacationOwner: boolean;
};
