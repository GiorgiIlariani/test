import { SetState } from 'types';

export type UserManagementFilterDropdownProps = {
  filterUsers: (status: string[]) => void;
  status: string[];
  setStatus: SetState<string[]>;
};
