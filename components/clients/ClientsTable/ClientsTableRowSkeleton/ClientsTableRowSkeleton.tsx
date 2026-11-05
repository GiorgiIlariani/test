import { cn } from 'lib';
import { ClientsTableCell } from '../ClientsTableCell';
import { CLIENTS_TABLE_GRID_LAYOUT, CLIENTS_TABLE_HEADERS } from 'config';

const ClientsTableRowSkeleton: React.FC = () => {
  return (
    <li
      className={cn('py-3 border border-gray-100 rounded-md bg-white', CLIENTS_TABLE_GRID_LAYOUT)}
    >
      {Array.from({ length: CLIENTS_TABLE_HEADERS.length }).map((_, i) => (
        <ClientsTableCell key={i}>
          <div className='bg-muted animate-pulse h-6 w-full rounded-md' />
        </ClientsTableCell>
      ))}
    </li>
  );
};

export default ClientsTableRowSkeleton;
