import { Modal } from 'components';
import { Props } from './types';

const DeleteFieldModal = ({ label, name, submitting = false, onClose, onConfirm }: Props) => (
  <Modal
    open
    onOpenChange={(nextOpen) => {
      if (submitting || nextOpen) return;
      onClose();
    }}
    title={`Delete ${label}?`}
    description={`“${name}” will be removed from this configuration. This cannot be undone.`}
    submitting={submitting}
    closeButtonText='Cancel'
    confirmButtonText='Delete'
    confirmButtonTextSubmitting='Deleting...'
    confirmButtonVariant='destructive'
    contentClassName='max-w-md'
    onConfirm={onConfirm}
  >
    {null}
  </Modal>
);

export default DeleteFieldModal;
