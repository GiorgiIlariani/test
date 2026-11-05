import { useFieldArray, useFormContext } from 'react-hook-form';
import { ClientFormValues } from 'schemas';

export const useClientContactInformationForm = () => {
  const { control } = useFormContext<ClientFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
    keyName: 'fieldKey',
  });

  return { fields, append, remove };
};
