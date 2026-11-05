import { Button, FieldGroup, FormInput, FormSelect } from 'components';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { AccountTabProps } from './types';
import { TrashIcon } from 'lucide-react';

const AccountTab: React.FC<AccountTabProps> = ({
  form,
  roles,
  canUpdate,
  canDelete,
  deleteError,
  onSubmit,
  onDelete,
}) => {
  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className='grid grid-cols-2 gap-6'>
            <FormInput
              name='first_name'
              label='First name'
              placeholder='First name'
              disabled={!canUpdate}
              rules={{ required: 'First name is required' }}
              required
            />
            <FormInput
              name='last_name'
              label='Last name'
              placeholder='Last name'
              disabled={!canUpdate}
              rules={{ required: 'Last name is required' }}
              required
            />
          </div>

          <FormSelect
            name='role'
            label='Role'
            placeholder='Select a role'
            disabled={!canUpdate}
            items={roles.map((role) => ({
              value: role.id.toString(),
              label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
            }))}
            rules={{ required: 'Role is required' }}
            required
          />
        </FieldGroup>

        {canDelete && (
          <div className='mt-6 flex items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4'>
            <div className='flex items-center gap-3'>
              <div className='grid size-10 shrink-0 place-content-center rounded-full bg-destructive/10'>
                <TrashIcon className='size-5 text-destructive' />
              </div>

              <div className='flex flex-col gap-0.5'>
                <p className='font-medium'>Delete account</p>
                <p className='text-muted-foreground'>
                  Permanently remove this user. This cannot be undone.
                </p>
                {deleteError && <p className='text-xs text-destructive'>{deleteError}</p>}
              </div>
            </div>

            <Button type='button' variant='destructive' className='shrink-0' onClick={onDelete}>
              Delete
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default AccountTab;
