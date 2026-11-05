import { Modal } from 'components';
import React from 'react';
import { UserSummary } from '../UserSummary';
import { DeleteUserModalProps } from './types';

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isDeleting) onClose();
      }}
      title='Delete user?'
      description='This will permanently remove the user. This cannot be undone.'
      closeButtonText='Cancel'
      confirmButtonText='Delete user'
      confirmButtonTextSubmitting='Deleting...'
      confirmButtonVariant='destructive'
      submitting={isDeleting}
      onConfirm={onConfirm}
      showCloseButton={false}
      contentClassName='max-w-md'
    >
      <div className='rounded-lg border bg-muted/40 p-3'>
        <UserSummary user={user} />
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
