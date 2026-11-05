import { CLIENTS_TABLE_GRID_LAYOUT, CLIENTS_TABLE_HEADERS } from 'config';
import { cn } from 'lib';

const ClientsTableHeader: React.FC = () => {
  return (
    <ul
      className={cn(
        'border border-gray-100 rounded-md bg-white sticky top-0 z-20 mb-2',
        CLIENTS_TABLE_GRID_LAYOUT,
      )}
    >
      {CLIENTS_TABLE_HEADERS.map((header) => (
        <li
          key={header}
          className='not-last:border-r nth-last-[2]:border-none border-gray-100 px-3 py-2 text-[#5A636F] text-xs font-medium'
        >
          {header}
        </li>
      ))}
    </ul>
  );
};

export default ClientsTableHeader;
