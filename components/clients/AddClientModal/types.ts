import type { ClientDetail } from 'types';

export type AddClientModalProps = {
  open: boolean;
  loading: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refreshClients: () => void;
  selectedClient: ClientDetail | null;
};
