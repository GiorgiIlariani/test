import { WizardModal } from 'components';
import { FormProvider } from 'react-hook-form';
import { ClientContactInformationForm } from '../ClientContactInformationForm';
import { ClientDetailsForm } from '../ClientDetailsForm';
import { useAddClientModal } from './useAddClientModal';
import { clientFlow } from './clientFlow';
import type { AddClientModalProps } from './types';
import AddClientModalSkeleton from './AddClientModalSkeleton';

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  loading,
  onOpenChange,
  refreshClients,
  selectedClient,
}) => {
  const { form, onSubmit, validateDetails, isSubmitting, setFilesToBeRemoved } = useAddClientModal(
    onOpenChange,
    refreshClients,
    selectedClient,
  );

  return (
    <FormProvider {...form}>
      <WizardModal
        title={selectedClient ? `Update ${selectedClient.name}` : 'Create Client'}
        open={open}
        loading={loading}
        loadingFallback={<AddClientModalSkeleton />}
        onOpenChange={onOpenChange}
        definition={clientFlow}
        beforeNext={validateDetails}
        onSubmit={onSubmit}
        submitLabel={selectedClient ? 'Update' : 'Create'}
        submitting={isSubmitting}
      >
        {(stepper) =>
          stepper.match({
            details: () => (
              <ClientDetailsForm
                disabled={isSubmitting}
                onExistingDocumentRemove={(id) => {
                  setFilesToBeRemoved((current) => [...current, id]);
                }}
              />
            ),
            contactInformation: () => <ClientContactInformationForm disabled={isSubmitting} />,
          })
        }
      </WizardModal>
    </FormProvider>
  );
};

export default AddClientModal;
