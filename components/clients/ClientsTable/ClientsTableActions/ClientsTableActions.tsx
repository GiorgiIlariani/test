import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components';
import { EyeIcon, MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { ClientsTableActionsProps } from './types';

const ClientsTableActions: React.FC<ClientsTableActionsProps> = ({
  onEditClient,
  onViewClient,
  onDeleteClient,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontalIcon className='size-4' />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-auto'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onViewClient}>
            <EyeIcon className='size-4' />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onEditClient}>
            <PencilIcon className='size-4' />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant='destructive' onClick={onDeleteClient}>
            <TrashIcon className='size-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientsTableActions;
