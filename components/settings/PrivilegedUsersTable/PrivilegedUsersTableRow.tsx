import {
  Badge,
  Button,
  PrivilegedUserEditModal,
  ShadcnTableCell,
  ShadcnTableRow,
} from 'components';
import { usePrivilegedUsersTableRow } from 'components/adminDashboard/PrivilegedUsersTableRow/usePrivilegedUsersTableRow';
import { getCookie } from 'cookies-next';
import { can } from 'helpers';
import { cn } from 'lib';
import { ChevronRightIcon, LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { getRoleBadgeStyle } from './helpers';
import { PrivilegedUsersTableRowProps } from './types';
import UserSummary from './UserSummary';

const PrivilegedUsersTableRow: React.FC<PrivilegedUsersTableRowProps> = ({
  user,
  roles,
  permissions,
  setUsersState,
}) => {
  const {
    isModalOpen,
    modalToggler,
    handleImpersonate,
    isImpersonateLoading,
    authUser,
    canUserUpdateOrDelete,
    canImpersonate,
  } = usePrivilegedUsersTableRow(permissions);

  const canViewEmployee = can('employee::view', permissions);

  return (
    <>
      {isModalOpen && can('user::view', permissions) && (
        <PrivilegedUserEditModal
          setUsers={setUsersState}
          user={user}
          modalCloser={modalToggler}
          roles={roles}
          permissions={permissions}
        />
      )}

      <ShadcnTableRow>
        <ShadcnTableCell>
          {canViewEmployee ? (
            <Link
              href={`/employee/${user.id}/information`}
              target='_blank'
              rel='noreferrer'
              className='group grid min-w-0 grid-cols-[auto_1fr] items-center gap-x-4'
            >
              <UserSummary user={user} canViewEmployee={canViewEmployee} />
            </Link>
          ) : (
            <div className='group grid min-w-0 grid-cols-[auto_1fr] items-center gap-x-4'>
              <UserSummary user={user} canViewEmployee={canViewEmployee} />
            </div>
          )}
        </ShadcnTableCell>

        <ShadcnTableCell>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold capitalize',
              getRoleBadgeStyle(user.role),
            )}
          >
            {user.role}
          </span>
        </ShadcnTableCell>

        <ShadcnTableCell>
          <Badge
            variant={
              user.status === 'active'
                ? 'success'
                : user.status === 'inactive'
                ? 'destructive'
                : user.status === 'pending'
                ? 'warning'
                : 'draft'
            }
            size='lg'
            className='capitalize'
          >
            {user.status}
          </Badge>
        </ShadcnTableCell>

        <ShadcnTableCell>
          <div className='flex items-center justify-end gap-6'>
            {canImpersonate && (
              <Button
                variant='outline'
                disabled={
                  user.status !== 'active' ||
                  !!getCookie('impersonation_token') ||
                  user.id === authUser.id ||
                  isImpersonateLoading
                }
                onClick={() => handleImpersonate(user.id)}
              >
                {isImpersonateLoading && <LoaderCircleIcon className='animate-spin' />}
                {isImpersonateLoading ? 'Impersonating...' : 'Impersonate'}
              </Button>
            )}

            <Button
              variant='ghost'
              className='text-primary hover:text-primary'
              onClick={modalToggler}
            >
              {canUserUpdateOrDelete ? 'Edit' : 'View'}
              <ChevronRightIcon />
            </Button>
          </div>
        </ShadcnTableCell>
      </ShadcnTableRow>
    </>
  );
};

export default PrivilegedUsersTableRow;
