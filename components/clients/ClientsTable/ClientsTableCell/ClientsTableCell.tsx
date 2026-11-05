import { cn } from 'lib';
import { ClientsTableCellProps } from './types';

const ClientsTableCell: React.FC<ClientsTableCellProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        'not-last:border-r border-gray-100 flex items-center h-11 px-3 text-xs text-muted-foreground',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ClientsTableCell;
