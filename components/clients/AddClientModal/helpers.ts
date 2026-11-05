import type { ClientDetail } from 'types';
import type { ClientFormValues } from 'schemas';
import type { ClientWizardStepper } from './clientFlow';

export const handleInvalidSteps = async (stepper: ClientWizardStepper, fields: string[]) => {
  const hasContactErrors = fields.some(
    (field) => field === 'contacts' || field.startsWith('contacts.'),
  );
  const hasDetailErrors = fields.some(
    (field) => field !== 'contacts' && !field.startsWith('contacts.'),
  );

  if (hasDetailErrors) stepper.setComplete('details', false);
  if (hasContactErrors) stepper.setComplete('contactInformation', false);

  if (hasContactErrors) {
    await stepper.goTo('contactInformation');
  } else if (hasDetailErrors) {
    await stepper.goTo('details');
  }
};

export const getDefaultValues = (selectedClient: ClientDetail | null): ClientFormValues => ({
  logo: selectedClient?.logo || null,
  name: selectedClient?.name ?? '',
  tax_id: selectedClient?.tax_id || null,
  address: selectedClient?.address ?? null,
  agreement_number: selectedClient?.agreement_number ?? null,
  payment_deadline_in_days: selectedClient?.payment_deadline_in_days ?? null,
  payment_deadline_type: selectedClient?.payment_deadline_type || 'c',
  documents: selectedClient?.documents || null,
  contacts:
    selectedClient?.contacts.map((contact) => ({
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      recipient_type: contact.recipient_type,
    })) ?? [],
});

export const getClientPayload = (data: ClientFormValues): ClientFormValues => ({
  ...data,
  documents: data.documents?.filter((file) => file instanceof File) ?? null,
});
