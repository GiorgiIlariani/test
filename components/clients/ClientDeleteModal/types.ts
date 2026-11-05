import { ClientDetail, ClientSummary } from 'types';

export type ClientDeleteModalProps = {
  open: boolean;
  loading: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedClient: ClientDetail | null;
  clients: ClientSummary[];
  refreshClients: () => void;
};
