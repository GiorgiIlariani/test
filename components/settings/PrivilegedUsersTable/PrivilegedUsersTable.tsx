import {
  ShadcnTable,
  ShadcnTableBody,
  ShadcnTableCell,
  ShadcnTableFooter,
  ShadcnTableHead,
  ShadcnTableHeader,
  ShadcnTableRow,
} from 'components';
import React from 'react';
import { TABLE_HEADS } from './helpers';
import PrivilegedUsersTableRow from './PrivilegedUsersTableRow';
import { PrivilegedUsersTableProps } from './types';

const PrivilegedUsersTable: React.FC<PrivilegedUsersTableProps> = ({
  users,
  roles,
  permissions,
  setUsersState,
}) => {
  return (
    <div className='overflow-hidden rounded-lg border bg-card'>
      <ShadcnTable containerClassName='h-full overflow-auto'>
        <ShadcnTableHeader className='sticky top-0 z-10'>
          <ShadcnTableRow>
            {TABLE_HEADS.map((head, index) => (
              <ShadcnTableHead key={index}>{head.label}</ShadcnTableHead>
            ))}
          </ShadcnTableRow>
        </ShadcnTableHeader>

        <ShadcnTableBody>
          {users.length === 0 ? (
            <ShadcnTableRow className='hover:bg-transparent'>
              <ShadcnTableCell colSpan={TABLE_HEADS.length} className='h-32 text-center'>
                <div className='flex flex-col items-center gap-1'>
                  <p className='font-medium'>No users found</p>
                  <p className='text-muted-foreground'>Try adjusting your filters.</p>
                </div>
              </ShadcnTableCell>
            </ShadcnTableRow>
          ) : (
            users.map((user) => (
              <PrivilegedUsersTableRow
                key={user.id}
                user={user}
                roles={roles}
                permissions={permissions}
                setUsersState={setUsersState}
              />
            ))
          )}
        </ShadcnTableBody>

        {users.length > 0 && (
          <ShadcnTableFooter className='sticky bottom-0 z-10'>
            <ShadcnTableRow>
              <ShadcnTableCell colSpan={TABLE_HEADS.length}>
                <span className='text-muted-foreground'>
                  Showing {users.length} {users.length === 1 ? 'user' : 'users'}
                </span>
              </ShadcnTableCell>
            </ShadcnTableRow>
          </ShadcnTableFooter>
        )}
      </ShadcnTable>
    </div>
  );
};

export default PrivilegedUsersTable;
