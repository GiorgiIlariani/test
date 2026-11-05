import { FormProvider } from 'react-hook-form';
import { Trash2Icon } from 'lucide-react';
import { PROJECT_TYPE, PROJECT_TYPE_OPTIONS } from 'config';
import { FieldGroup, FieldSet, FormCombobox, FormSelect, Modal, NewTab } from 'components';
import { ClientDeleteModalProps } from './types';
import { useClientDeleteModal } from './useClientDeleteModal';
import Image from 'next/image';
import { generateAvatarSrc } from 'helpers';
import Link from 'next/link';
import ClientDeleteSkeleton from './ClientDeleteModalSkeleton';

const ClientDeleteModal: React.FC<ClientDeleteModalProps> = ({
  open,
  loading,
  onOpenChange,
  selectedClient,
  clients,
  refreshClients,
}) => {
  const {
    form,
    handleDelete,
    canDelete,
    isSubmitting,
    clientOptions,
    departmentOptions,
    hasAssignedProjects,
    assignedProjects,
    projectUpdates,
  } = useClientDeleteModal(onOpenChange, selectedClient, clients, refreshClients);

  return (
    <Modal
      title={
        hasAssignedProjects
          ? `Delete ${selectedClient?.name ?? 'client'} and update ${
              assignedProjects.length
            } project${assignedProjects.length === 1 ? '' : 's'}`
          : `Delete ${selectedClient?.name ?? 'client'}`
      }
      description={
        hasAssignedProjects
          ? 'Choose where each assigned project should move before deleting this client.'
          : 'This client has no assigned projects. This action cannot be undone.'
      }
      open={open}
      loading={loading}
      onOpenChange={onOpenChange}
      confirmButtonText='Delete'
      confirmButtonTextSubmitting='Deleting...'
      confirmButtonVariant='destructive'
      confirmButtonDisabled={!canDelete}
      icon={<Trash2Icon className='text-destructive' />}
      iconWrapperClassName='bg-destructive/10'
      removeIconChildrenPadding={hasAssignedProjects}
      submitting={isSubmitting}
      onConfirm={handleDelete}
    >
      {loading ? (
        <ClientDeleteSkeleton />
      ) : hasAssignedProjects ? (
        <FormProvider {...form}>
          <FieldSet disabled={isSubmitting}>
            <FieldGroup>
              <ul className='flex flex-col gap-4'>
                {assignedProjects.map((project, index) => {
                  const selectedType =
                    projectUpdates[index]?.type ?? project.type ?? PROJECT_TYPE.DEFAULT;

                  return (
                    <li
                      key={project.id}
                      className='grid gap-3 rounded-md bg-muted border border-border p-3 sm:grid-cols-3'
                    >
                      <Link
                        href={`/projects/${project.id}/dashboard`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-start gap-1.5 self-start min-w-0 w-fit group'
                      >
                        <div className='relative shrink-0'>
                          <Image
                            width={24}
                            height={24}
                            src={project.logo ?? generateAvatarSrc(project.title)}
                            alt={project.title}
                            className='rounded-full size-6 object-cover shrink-0'
                          />
                          <div className='size-full rounded-full hidden group-hover:flex items-center justify-center bg-black/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                            <NewTab size='12' color='white' className='hidden group-hover:flex' />
                          </div>
                        </div>

                        <p className='font-medium wrap-anywhere group-hover:underline mt-1 leading-none'>
                          {project.title}
                        </p>
                      </Link>

                      <FormSelect
                        name={`projects.${index}.type`}
                        label='Project type'
                        items={PROJECT_TYPE_OPTIONS.map((option) => ({
                          value: option.value,
                          label: option.text,
                        }))}
                        onChangeHandler={(value) => {
                          if (value === PROJECT_TYPE.DEFAULT) {
                            form.setValue(`projects.${index}.department_id`, null, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          } else {
                            form.setValue(`projects.${index}.client_id`, null, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }
                        }}
                        triggerClassName='bg-background'
                        required
                      />

                      {selectedType === PROJECT_TYPE.DEFAULT ? (
                        <FormCombobox
                          key={`project-${project.id}-client`}
                          name={`projects.${index}.client_id`}
                          label='Client'
                          placeholder='Google'
                          items={clientOptions}
                          emptyText='No clients found.'
                          inputWrapperClassName='bg-background'
                          required
                        />
                      ) : (
                        <FormCombobox
                          key={`project-${project.id}-department`}
                          name={`projects.${index}.department_id`}
                          label='Department'
                          placeholder='HR'
                          items={departmentOptions}
                          emptyText='No departments found.'
                          inputWrapperClassName='bg-background'
                          required
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </FieldGroup>
          </FieldSet>
        </FormProvider>
      ) : (
        <p className='text-sm text-muted-foreground'>
          Confirm deletion to remove this client from the clients list.
        </p>
      )}
    </Modal>
  );
};

export default ClientDeleteModal;
