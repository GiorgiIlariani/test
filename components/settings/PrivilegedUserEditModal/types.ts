import { Permission, PrivilegedUserEditFormFields, PrivilegedUsers } from 'types';

export type PrivilegedUserEditModalProps = {
  modalCloser: () => void;
  user: PrivilegedUsers;
  setUsers: (
    userId: number,
    roles?: { id: number; name: string }[] | undefined,
    data?: PrivilegedUserEditFormFields | undefined,
    updating?: boolean | undefined,
  ) => void;
  roles: { id: number; name: string }[];
  permissions: Permission[];
};

export type SetUsers = PrivilegedUserEditModalProps['setUsers'];

export type EditModalTab = 'account' | 'recovery';
