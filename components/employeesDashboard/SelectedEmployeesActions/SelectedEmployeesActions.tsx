import React from 'react';
import { TrashCan, ErrorModal, Button, PortalWrapper } from 'components';
import { useSelectedEmployeesActions } from './useSelectedEmployeesActions';
import { Props } from './types';
import { analytics, can } from 'helpers';

const SelectedEmployeesActions: React.FC<Props> = (props) => {
  const {
    error,
    deleteModalIsOpen,
    setDeleteModalIsOpen,
    clearSelectedEmployees,
    deleteLoading,
    deleteHandler,
  } = useSelectedEmployeesActions(
    props.selectedEmployees,
    props.setSelectedEmployees,
    props.employees,
    props.dispatchEmployeeInfo,
  );

  return (
    <div>
      {deleteModalIsOpen && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete account?'
            modalTitle='Delete account'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => {
              setDeleteModalIsOpen(false);
            }}
            confirmFunction={deleteHandler}
            isLoading={deleteLoading}
          />
        </PortalWrapper>
      )}

      {error && <div className='mb-1 flex h-6 items-end text-xs text-destructive'>{error}</div>}

      <div className='flex items-center gap-6'>
        <span className='font-medium'>{props.selectedEmployees.length} Selected</span>

        <div className='flex items-center gap-1'>
          {can('employee::delete', props.permissions) && (
            <Button
              onClick={() => {
                analytics.track('Employee Dashboard - Delete User');
                setDeleteModalIsOpen(true);
              }}
            >
              <TrashCan color='white' className='size-3.5' />
              Delete
            </Button>
          )}

          <Button variant='link' onClick={() => clearSelectedEmployees()}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedEmployeesActions;
