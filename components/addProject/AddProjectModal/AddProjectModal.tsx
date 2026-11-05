import {
  Modal,
  FieldSet,
  FieldGroup,
  FormAvatarUpload,
  FormInput,
  FormSelect,
  FormCombobox,
  AddProjectModalSkeleton,
} from 'components';
import { FormProvider } from 'react-hook-form';
import { Props } from './types';
import { useAddProjectModal } from './useAddProjectModal';
import { PROJECT_TYPE_OPTIONS } from 'config';

const AddProjectModal: React.FC<Props> = (props) => {
  const {
    form,
    onSubmit,
    nonBillableDepartments,
    clients,
    projectType,
    isSubmitting,
    onCreateClient,
    isTemporaryClientSelected,
    resetTemporaryClients,
  } = useAddProjectModal(props.projectState, props.setProjectState, props.defaultCurrency);

  return (
    <Modal
      title={props.projectState?.id ? `Update ${props.projectState?.title}` : 'Create new project'}
      open={props.open}
      onOpenChange={(open) => {
        props.onOpenChange(open);
        if (!open) {
          form.reset();
          resetTemporaryClients();
        }
      }}
      confirmButtonText={props.projectState?.id ? 'Update' : 'Create'}
      confirmButtonTextSubmitting={props.projectState?.id ? 'Updating...' : 'Creating...'}
      onConfirm={form.handleSubmit(onSubmit)}
      submitting={isSubmitting}
      loading={props.projectIsLoading}
    >
      <FormProvider {...form}>
        <FieldSet disabled={isSubmitting}>
          <FieldGroup>
            {props.projectIsLoading ? (
              <AddProjectModalSkeleton />
            ) : (
              <>
                <FormAvatarUpload name='logo' direction='column' wrapperClassName='w-max mx-auto' />
                <FormInput name='title' label='Project name' placeholder='Skippit' required />
                <FormCombobox
                  name='owner_id'
                  label='Project owner'
                  placeholder='Taso Doe'
                  items={props.projectOwners.map((owner) => ({
                    value: owner.id,
                    label: owner.name,
                  }))}
                  required
                />
                <FormSelect
                  name='type'
                  label='Project type'
                  placeholder='Client Project'
                  items={PROJECT_TYPE_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.text,
                  }))}
                  required
                />
                {projectType === 'default' ? (
                  <FormCombobox
                    key='project-client'
                    name='client_id'
                    label='Client'
                    placeholder='Google'
                    description={
                      isTemporaryClientSelected
                        ? 'This client will be created when you submit the project. Add its full billing and administrative details from the Clients page afterward.'
                        : undefined
                    }
                    items={clients.map((client) => ({
                      value: client.id,
                      label: client.name,
                    }))}
                    required
                    creatable
                    onCreateClick={(value) => onCreateClient(value)}
                  />
                ) : (
                  <FormCombobox
                    key='project-department'
                    name='department_id'
                    label='Department'
                    placeholder='HR'
                    items={nonBillableDepartments}
                    required
                  />
                )}
                <FormSelect
                  name='currency'
                  label='Currency'
                  items={[
                    {
                      value: 'GEL',
                      label: 'GEL',
                    },
                    {
                      value: 'GBP',
                      label: 'GBP',
                    },
                    {
                      value: 'EUR',
                      label: 'EUR',
                    },
                    {
                      value: 'USD',
                      label: 'USD',
                    },
                  ]}
                  required
                />
              </>
            )}
          </FieldGroup>
        </FieldSet>
      </FormProvider>
    </Modal>
  );
};

export default AddProjectModal;
