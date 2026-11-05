import { ClientSummary } from 'types';

export type ClientsTableRowProps = {
  client: ClientSummary;
  onEditClient: (clientId: number) => void;
  onViewClient: (clientId: number) => void;
  onDeleteClient: (clientId: number) => void;
};
