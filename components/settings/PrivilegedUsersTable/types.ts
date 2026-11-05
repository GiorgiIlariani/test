import { Permission, PrivilegedUsers } from 'types';
import { PrivilegedUsersTableRowProps as AdminPrivilegedUsersTableRowProps } from 'components/adminDashboard/PrivilegedUsersTableRow/types';

export type PrivilegedUsersTableProps = {
  users: PrivilegedUsers[];
  roles: { id: number; name: string }[];
  permissions: Permission[];
  setUsersState: AdminPrivilegedUsersTableRowProps['setUsersState'];
};

export type PrivilegedUsersTableRowProps = {
  user: PrivilegedUsers;
  roles: { id: number; name: string }[];
  permissions: Permission[];
  setUsersState: PrivilegedUsersTableProps['setUsersState'];
};

export type UserSummaryProps = {
  user: PrivilegedUsers;
  canViewEmployee?: boolean;
};
