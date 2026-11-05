import { NewTab } from 'components';
import { generateAvatarSrc } from 'helpers';
import { cn } from 'lib';
import Image from 'next/image';
import React from 'react';
import { UserSummaryProps } from './types';

const UserSummary: React.FC<UserSummaryProps> = ({ user, canViewEmployee }) => {
  return (
    <>
      <Image
        className='col-start-1 row-span-2 row-start-1 size-10 rounded-full object-cover'
        width={100}
        height={100}
        src={user.avatar ?? generateAvatarSrc(user.first_name, user.last_name)}
        alt={`${user.first_name} ${user.last_name}`}
      />
      {canViewEmployee && (
        <NewTab
          size='16'
          color='var(--background)'
          className='col-start-1 row-span-2 row-start-1 hidden size-10 rounded-full bg-foreground/80 p-3 group-hover:block'
        />
      )}
      <p
        className={cn(
          'col-start-2 truncate font-medium',
          canViewEmployee && 'group-hover:underline',
        )}
      >
        {user.first_name} {user.last_name}
      </p>
      <p className='col-start-2 truncate text-muted-foreground'>{user.email}</p>
    </>
  );
};

export default UserSummary;
