import { CareerHistory, SetState, ShowPageEmployee } from 'types';

export type Props = {
  setActionsAreAdded: SetState<boolean>;
  userId: number;
  employee: ShowPageEmployee;
  refetchEmployees?: () => void;
  careerLog: CareerHistory[];
};
