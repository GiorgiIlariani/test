import { Permission } from 'types';
import { Budgeting } from 'types/Budget';

export type Props = {
  isLoading: boolean;
  cardInfo: Budgeting | undefined;
  deleteHandler: (id: number) => void;
  archiveHandler: (id: number) => void;
  unarchiveHandler: (id: number) => void;
  permissions: Permission[];
};
