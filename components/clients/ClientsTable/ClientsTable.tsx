import { ClientsTableProps } from './types';
import {
  ClientsTableHeader,
  ClientsTableRow,
  ClientsTableRowSkeleton,
  EmptyBudgetEmoji,
} from 'components';
import { CLIENTS_TABLE_MIN_WIDTH } from 'config';
import { cn } from 'lib';

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  areClientsLoading,
  onEditClient,
  onViewClient,
  onDeleteClient,
}) => {
  return (
    <div className='w-full min-w-0 overflow-x-auto'>
      <div className={cn('w-full', CLIENTS_TABLE_MIN_WIDTH)}>
        <ClientsTableHeader />

        <ul className='flex w-full flex-col gap-2'>
          {areClientsLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ClientsTableRowSkeleton key={i} />)
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <ClientsTableRow
                key={client.id}
                client={client}
                onEditClient={onEditClient}
                onViewClient={onViewClient}
                onDeleteClient={onDeleteClient}
              />
            ))
          ) : (
            <li className='flex flex-col gap-6 items-center justify-center mt-20 mb-16'>
              <EmptyBudgetEmoji />

              <div className='flex flex-col gap-2 text-center'>
                <h3 className='font-medium'>No clients</h3>
                <p className='text-sm text-muted-foreground'>There are no clients, yet.</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
