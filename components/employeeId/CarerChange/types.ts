import { CareerHistory, SetState, ShowPageEmployee } from 'types';

export type Props = {
  toggleModal: () => void;
  setActionsAreAdded: SetState<boolean>;
  employee: ShowPageEmployee;
  userId: number;
  refetchEmployees?: () => void;
  careerLog: CareerHistory[];
  joinDate?: string;
  defaultDate?: string;
  titleSuffix?: string;
  previousButtonText?: string;
  previousStepHandler?: () => void;
  isInBudgetView?: boolean;
};
