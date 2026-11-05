import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type ClientDetailsFormValues, type ClientFormValues, clientFormSchema } from 'schemas';
import { deleteMediaRequest, storeProjectClientRequest, updateClientRequest } from 'services';
import { ClientDetail } from 'types';
import { getClientPayload, getDefaultValues, handleInvalidSteps } from './helpers';
import type { ClientWizardStepper } from './clientFlow';

const detailFields: (keyof ClientDetailsFormValues)[] = [
  'logo',
  'name',
  'tax_id',
  'address',
  'agreement_number',
  'payment_deadline_in_days',
  'payment_deadline_type',
  'documents',
];

export const useAddClientModal = (
  onOpenChange: (isOpen: boolean) => void,
  refreshClients: () => void,
  selectedClient: ClientDetail | null,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filesToBeRemoved, setFilesToBeRemoved] = useState<number[]>([]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: getDefaultValues(selectedClient),
  });

  const { reset } = form;

  useEffect(() => {
    reset(getDefaultValues(selectedClient));
  }, [reset, selectedClient]);

  const validateDetails = () => form.trigger(detailFields);

  const onSubmit = async (stepper: ClientWizardStepper) => {
    let submitted = false;

    await form.handleSubmit(
      async (data) => {
        setIsSubmitting(true);

        try {
          const token = getCookie('token');
          const payload = getClientPayload(data);

          if (selectedClient) {
            await updateClientRequest(token, payload, selectedClient.id);

            if (filesToBeRemoved.length > 0) {
              await deleteMediaRequest(token, filesToBeRemoved);
            }
          } else {
            await storeProjectClientRequest(token, payload);
          }

          refreshClients();
          onOpenChange(false);
          submitted = true;
        } catch (error: any) {
          if (error?.response?.status === 422) {
            const backendErrors = error.response.data.errors;

            handleBackendErrors(backendErrors, form.setFocus, form.setError);

            await handleInvalidSteps(stepper, Object.keys(backendErrors));
          } else {
            toastGeneralError(error);
          }
        } finally {
          setIsSubmitting(false);
        }
      },
      (errors) => {
        handleInvalidSteps(stepper, Object.keys(errors));
      },
    )();

    return submitted;
  };

  return {
    form,
    onSubmit,
    validateDetails,
    isSubmitting,
    setFilesToBeRemoved,
  };
};
