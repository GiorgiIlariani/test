import { Permission, PrivilegedUserEditFormFields, PrivilegedUsers } from 'types';

export type PrivilegedUsersTableRowProps = {
  user: PrivilegedUsers;
  setUsersState: (
    userId: number,
    roles?: { id: number; name: string }[] | undefined,
    role?: PrivilegedUserEditFormFields | undefined,
    updating?: boolean | undefined,
  ) => void;
  roles: { id: number; name: string }[];
  permissions: Permission[];
};
