import { SetState } from 'types';

export type Props = {
  toggleModal: () => void;
  userId: number;
  setActionsAreAdded: SetState<boolean>;
  joinDate: string;
  defaultDate?: string;
  refetchEmployees?: () => void;
  isInBudgetView?: boolean;
};
