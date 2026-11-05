import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ShadcnSidebarMenuButton,
} from 'components';
import { logOutHandler } from 'components/shared/Layout/helper';
import { generateAvatarSrc } from 'helpers';
import { CheckIcon, ChevronsUpDownIcon, LogOutIcon, UserRoundIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUserMenu } from './useUserMenu';
import type { UserMenuProps } from './types';

const UserMenu = ({ mobile = false }: UserMenuProps) => {
  const {
    router,
    user,
    userOrganizations,
    notificationSum,
    isImpersonating,
    switchOrganizationHandler,
  } = useUserMenu();

  const avatarContent = (
    <Avatar className='size-8 shrink-0 rounded-lg'>
      <AvatarImage
        src={user.avatar ?? generateAvatarSrc(user.first_name, user.last_name)}
        alt={user.name}
      />
      <AvatarFallback>RB</AvatarFallback>
    </Avatar>
  );

  const triggerContent = (
    <>
      {avatarContent}

      {mobile && (
        <>
          <div className='grid min-w-0 flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-medium'>{user.name}</span>
            <span className='truncate text-xs'>{user.email}</span>
          </div>

          <ChevronsUpDownIcon className='ml-auto size-4 shrink-0' />
        </>
      )}
    </>
  );

  return (
    <DropdownMenu>
      {mobile ? (
        <ShadcnSidebarMenuButton
          render={<DropdownMenuTrigger />}
          size='lg'
          className='data-popup-open:bg-sidebar-accent'
        >
          {triggerContent}
        </ShadcnSidebarMenuButton>
      ) : (
        <DropdownMenuTrigger className=''>{triggerContent}</DropdownMenuTrigger>
      )}

      <DropdownMenuContent
        side={mobile ? 'top' : 'bottom'}
        align={mobile ? 'start' : 'end'}
        className='w-62'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className='flex items-center gap-2 text-foreground font-normal'>
            {avatarContent}

            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{user.name}</span>
              <span className='truncate text-xs'>{user.email}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {userOrganizations.length > 1 && !isImpersonating && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch User Organizations</DropdownMenuLabel>
            {userOrganizations.map((organization) => {
              const amount = organization.active ? notificationSum : organization.notification_sum;

              return (
                <DropdownMenuItem
                  key={organization.id}
                  className='flex items-center'
                  disabled={organization.active}
                  onClick={() => switchOrganizationHandler(organization.id)}
                >
                  <Image
                    className='size-4 object-cover rounded-full transition-opacity duration-500'
                    width={100}
                    height={100}
                    src={organization.logo ?? generateAvatarSrc(organization.id)}
                    alt={organization.name}
                  />

                  <p className='min-w-0 truncate'>{organization.name}</p>

                  {Number(amount) > 0 && (
                    <span className='rounded-full bg-redberry-red px-1.5 py-0.5 text-2xs leading-none text-white'>
                      {Number(amount) > 99 ? '99+' : amount}
                    </span>
                  )}

                  {organization.active && (
                    <div className='flex items-center gap-1.5 ml-auto'>
                      <span className='px-1 rounded border bg-muted text-2xs capitalize'>
                        {user.role}
                      </span>

                      <CheckIcon className='text-primary' />
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        )}

        {userOrganizations.length > 1 && !isImpersonating && <DropdownMenuSeparator />}

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href={`/employee/${user.id}/information`} />}>
            <UserRoundIcon /> Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant='destructive' onClick={() => logOutHandler(router)}>
            <LogOutIcon /> Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
