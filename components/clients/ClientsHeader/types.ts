import { Permission } from 'types';

export type ClientsHeaderProps = {
  permissions: Permission[];
  onOpen: () => void;
};
