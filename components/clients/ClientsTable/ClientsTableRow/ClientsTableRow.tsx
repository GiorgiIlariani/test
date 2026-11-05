import { cn } from 'lib';
import Image from 'next/image';

import { ClientsTableRowProps } from './types';
import { generateAvatarSrc, getDocumentTypeIcon } from 'helpers';
import { CLIENTS_TABLE_GRID_LAYOUT } from 'config';
import { ClientsTableActions, ClientsTableCell } from 'components';

const ClientsTableRow: React.FC<ClientsTableRowProps> = ({
  client,
  onEditClient,
  onViewClient,
  onDeleteClient,
}) => {
  return (
    <li
      className={cn('py-3 border border-gray-100 rounded-md bg-white', CLIENTS_TABLE_GRID_LAYOUT)}
    >
      <ClientsTableCell
        className='text-base font-medium text-foreground hover:text-primary transition-colors cursor-pointer gap-1'
        onClick={() => onViewClient(client.id)}
      >
        <Image
          width={24}
          height={24}
          src={client.logo ?? generateAvatarSrc(client.name)}
          alt={client.name}
          className='rounded-full size-6 object-cover shrink-0'
        />
        <span className='truncate'>{client.name}</span>
      </ClientsTableCell>

      <ClientsTableCell>{client.tax_id || '—'}</ClientsTableCell>

      <ClientsTableCell>
        <span className='truncate'>{client.address || '—'}</span>
      </ClientsTableCell>

      <ClientsTableCell className='text-primary gap-3'>
        {client.payment_deadline_in_days}
        <span className='bg-primary-foreground rounded-full px-2 h-6 flex items-center justify-center'>
          {client.payment_deadline_type === 'c' ? 'Calendar Days' : 'Business Days'}
        </span>
      </ClientsTableCell>

      <ClientsTableCell>{client.agreement_number || '—'}</ClientsTableCell>

      <ClientsTableCell>
        <button
          type='button'
          className='text-primary hover:underline'
          onClick={() => onViewClient(client.id)}
        >
          {client.contacts_count} {client.contacts_count === 1 ? 'contact' : 'contacts'}
        </button>
      </ClientsTableCell>

      <ClientsTableCell className='gap-2 overflow-x-auto no-scrollbar'>
        {client.document_type_counts.length
          ? client.document_type_counts.map(({ type, count }) => (
              <span key={type} className='flex items-center'>
                {getDocumentTypeIcon(type)}({count})
              </span>
            ))
          : '—'}
      </ClientsTableCell>

      <ClientsTableCell className='shrink-0'>
        <ClientsTableActions
          onEditClient={() => onEditClient(client.id)}
          onViewClient={() => onViewClient(client.id)}
          onDeleteClient={() => onDeleteClient(client.id)}
        />
      </ClientsTableCell>
    </li>
  );
};

export default ClientsTableRow;
