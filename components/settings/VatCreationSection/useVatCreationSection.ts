import { useFieldArray, useFormContext } from 'react-hook-form';

export const useVatCreationSection = () => {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: 'vats', control: form.control });

  const addNewVat = () => {
    append({ id: null, name: '', value: '' });
  };

  const checkForDuplicates = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return 'required';
    }
    return (
      form
        .getValues(`vats`)
        .filter(
          (item: { name: string }) => item.name.trim().toLowerCase() === trimmedValue.toLowerCase(),
        ).length === 1 || `Name already exists`
    );
  };

  return { fields, addNewVat, remove, checkForDuplicates, getValues: form.getValues };
};
