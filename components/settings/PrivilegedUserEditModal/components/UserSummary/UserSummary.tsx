import { generateAvatarSrc } from 'helpers';
import Image from 'next/image';
import React from 'react';
import { UserSummaryProps } from './types';

const UserSummary: React.FC<UserSummaryProps> = ({ user }) => {
  return (
    <div className='flex min-w-0 items-center gap-3'>
      <Image
        className='size-10 shrink-0 rounded-full object-cover'
        width={100}
        height={100}
        src={user.avatar ?? generateAvatarSrc(user.first_name, user.last_name)}
        alt={`${user.first_name} ${user.last_name}`}
      />
      <div className='flex min-w-0 flex-col gap-1'>
        <p className='truncate text-base font-semibold'>
          {user.first_name} {user.last_name}
        </p>
        <p className='truncate text-sm font-normal text-muted-foreground'>{user.email}</p>
      </div>
    </div>
  );
};

export default UserSummary;
