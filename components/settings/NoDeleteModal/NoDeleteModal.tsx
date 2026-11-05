import { Modal } from 'components';
import { generateAvatarSrc } from 'helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useNoDeleteModal } from './useNoDeleteModal';
import { Props } from './types';

const NoDeleteModal = ({
  closeModal,
  name,
  employees,
  deleteSkill,
  optionName,
  existsInOtherData,
  isParent,
  submitting = false,
}: Props) => {
  const { warningMessage, showOtherDataWarning } = useNoDeleteModal(
    name,
    employees,
    existsInOtherData,
    isParent,
    optionName,
  );
  const canForceDelete = name === 'skills';

  return (
    <Modal
      open
      onOpenChange={(nextOpen) => {
        if (submitting || nextOpen) return;
        closeModal();
      }}
      title={`Delete ${name === 'titles' ? 'job title' : name}`}
      submitting={submitting}
      closeButtonText='Cancel'
      confirmButtonText={canForceDelete ? 'Delete anyways' : 'OK'}
      confirmButtonTextSubmitting='Deleting...'
      confirmButtonVariant={canForceDelete ? 'destructive' : 'default'}
      contentClassName='max-w-lg'
      onConfirm={async () => {
        if (submitting) return;
        if (!canForceDelete) {
          closeModal();
          return;
        }

        const deleted = await deleteSkill();
        if (deleted) closeModal();
      }}
    >
      <div className='text-sm leading-6 text-muted-foreground'>{warningMessage}</div>
      {!showOtherDataWarning && employees.length > 0 ? (
        <div className='max-h-60 overflow-y-auto rounded-md border bg-muted p-4'>
          <div className='flex flex-col gap-4'>
            {employees.map((employee) => (
              <Link href={`/employee/${employee.id}/information`} target='_blank' key={employee.id}>
                <figure className='group flex items-center gap-2'>
                  <Image
                    className='h-10 w-10 shrink-0 rounded-full object-cover'
                    width={100}
                    height={100}
                    src={
                      employee.avatar ??
                      generateAvatarSrc(employee.name.split(' ')[0], employee.name.split(' ')[1])
                    }
                    alt={employee.name}
                  />
                  <span className='capitalize group-hover:underline'>{employee.name}</span>
                </figure>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default NoDeleteModal;
