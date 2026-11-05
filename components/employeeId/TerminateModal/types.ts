import { SetState, UserProject } from 'types';

export type Props = {
  toggleModal: () => void;
  userId: number;
  setActionsAreAdded: SetState<boolean>;
  joinDate: string;
  setCanNotTerminate: SetState<boolean>;
  setUserProjectsInfo: SetState<UserProject[]>;
  refetchEmployees?: () => void;
  defaultDate?: string;
  titleSuffix?: string;
  previousStepHandler?: () => void;
  previousButtonText?: string;
  isInBudgetView?: boolean;
};
