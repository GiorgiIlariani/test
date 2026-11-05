import { ClientSummary } from 'types';

export type ClientsTableProps = {
  clients: ClientSummary[];
  areClientsLoading: boolean;
  onEditClient: (clientId: number) => void;
  onViewClient: (clientId: number) => void;
  onDeleteClient: (clientId: number) => void;
};
