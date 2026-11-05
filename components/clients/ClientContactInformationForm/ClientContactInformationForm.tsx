import { Button, FieldGroup, FieldSet, FormInput, FormSelect } from 'components';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useClientContactInformationForm } from './useClientContactInformationForm';
import { ClientContactInformationFormProps } from './types';

const recipientTypes = [
  { value: 'to', label: 'To' },
  { value: 'cc', label: 'Cc' },
  { value: 'bcc', label: 'Bcc' },
];

const ClientContactInformationForm: React.FC<ClientContactInformationFormProps> = ({
  disabled = false,
}) => {
  const { fields, append, remove } = useClientContactInformationForm();

  return (
    <FieldSet disabled={disabled}>
      <FieldGroup>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='font-medium'>Contact people</p>
            <p className='text-xs text-muted-foreground'>
              Add the people who should receive client invoices.
            </p>
          </div>

          <Button
            type='button'
            variant='outline'
            onClick={() =>
              append({
                first_name: '',
                last_name: '',
                email: '',
                recipient_type: 'to',
              })
            }
          >
            <PlusIcon data-icon='inline-start' />
            Add contact person
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className='rounded-md border border-dashed px-4 py-10 text-center text-sm text-muted-foreground'>
            No contact people have been added.
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {fields.map((field, index) => (
              <div
                key={field.fieldKey}
                className='flex items-baseline-last gap-4 rounded-md border bg-muted/30 p-3'
              >
                <div className='flex gap-3'>
                  <FormInput
                    name={`contacts.${index}.first_name`}
                    label='Name'
                    placeholder='John'
                    inputClassName='bg-background'
                    required
                  />
                  <FormInput
                    name={`contacts.${index}.last_name`}
                    label='Surname'
                    placeholder='Doe'
                    inputClassName='bg-background'
                    required
                  />
                  <FormInput
                    name={`contacts.${index}.email`}
                    label='Email'
                    placeholder='john@example.com'
                    inputClassName='bg-background'
                    required
                  />
                  <FormSelect
                    name={`contacts.${index}.recipient_type`}
                    label='Recipient'
                    items={recipientTypes}
                    wrapperClassName='w-fit'
                    triggerClassName='bg-background'
                    required
                  />
                </div>

                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  aria-label={`Remove contact ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </FieldGroup>
    </FieldSet>
  );
};

export default ClientContactInformationForm;
