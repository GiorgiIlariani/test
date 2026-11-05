'use client';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Languages, SetState } from 'types';

export const useLanguageCard = (setRemovedItems?: SetState<number[]> | undefined) => {
  const { getValues, control } = useFormContext<{ languages: Languages[] }>();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'languages',
  });

  const appendNewLanguage = () => {
    !getValues('languages')?.some((item) => !item.language_id || !item.level) &&
      append(
        {
          id: '',
          language_id: '',
          title: '',
          level: '',
          file: { name: '' },
          canNotEdit: false,
          updated: false,
          delete_existing_file: 'false',
        },
        { shouldFocus: false },
      );
  };

  const removeLanguage = (i: number, language_id?: number | string) => {
    if (language_id) {
      setRemovedItems?.((prev) => prev.concat(+language_id));
      remove(i);
    } else {
      remove(i);
    }
  };
  return { appendNewLanguage, removeLanguage, fields };
};
