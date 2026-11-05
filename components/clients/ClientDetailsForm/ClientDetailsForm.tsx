import {
  FieldGroup,
  FieldSet,
  FormAvatarUpload,
  FormFileUpload,
  FormInput,
  FormInputWithOptions,
} from 'components';
import { DOCUMENTS_ACCEPT } from 'config';
import type { ClientDetailsFormProps } from './types';

const ClientDetailsForm: React.FC<ClientDetailsFormProps> = ({
  disabled = false,
  onExistingDocumentRemove,
}) => {
  return (
    <FieldSet disabled={disabled}>
      <FieldGroup>
        <FormAvatarUpload name='logo' direction='column' wrapperClassName='w-max mx-auto' />
        <FormInput name='name' label='Client name' placeholder='Google' required />
        <FormInput name='tax_id' label='Tax ID' placeholder='123456789' />
        <FormInput name='address' label='Address' placeholder='123 Main St' />
        <FormInputWithOptions
          name='payment_deadline_in_days'
          optionName='payment_deadline_type'
          options={[
            { value: 'c', label: 'Calendar days' },
            { value: 'w', label: 'Work days' },
          ]}
          label='Payment terms'
          placeholder='30'
          required
        />
        <FormInput name='agreement_number' label='Agreement number' placeholder='AGR-2026-005' />
        <FormFileUpload
          name='documents'
          label='Documents'
          accept={DOCUMENTS_ACCEPT}
          onRemove={(file) => {
            if ('id' in file) {
              onExistingDocumentRemove(file.id);
            }
          }}
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default ClientDetailsForm;
