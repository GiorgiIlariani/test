import { PrivilegedUsers } from 'types';

export type DeleteUserModalProps = {
  user: PrivilegedUsers;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
};
