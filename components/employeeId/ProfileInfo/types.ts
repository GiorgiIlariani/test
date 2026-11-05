import { SetState, ShowPageEmployee } from 'types';

export type Props = {
  employee: ShowPageEmployee;
  addProfileInfoIsOpen: boolean;
  setAddProfileInfoIsOpen: SetState<boolean>;
  refetchEmployees: () => void;
  isLoading: boolean;
  setEmployee: SetState<ShowPageEmployee>;
};
