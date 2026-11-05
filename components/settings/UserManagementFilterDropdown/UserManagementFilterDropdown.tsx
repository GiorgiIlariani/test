'use client';

import React from 'react';
import {
  buttonVariants,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from 'components';
import { cn } from 'lib';
import { ChevronDownIcon } from 'lucide-react';
import { STATUS_OPTIONS } from './helpers';
import { UserManagementFilterDropdownProps } from './types';
import { useUserManagementFilterDropdown } from './useUserManagementFilterDropdown';

const UserManagementFilterDropdown: React.FC<UserManagementFilterDropdownProps> = ({
  filterUsers,
  status,
  setStatus,
}) => {
  const { handleStatusChange, isLastSelected } = useUserManagementFilterDropdown(
    filterUsers,
    status,
    setStatus,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: 'outline' }), 'w-min capitalize')}
      >
        {status.join(', ')}
        <ChevronDownIcon className='transition-transform group-data-popup-open/button:rotate-180' />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-40'>
        <DropdownMenuGroup>
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={status.includes(option.value)}
              disabled={isLastSelected(option.value)}
              closeOnClick={false}
              onCheckedChange={(checked) => handleStatusChange(option.value, checked)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserManagementFilterDropdown;
