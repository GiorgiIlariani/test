'use client';

import { getCookie } from 'cookies-next';
import { useDebouncedSearch } from 'hooks';
import { UseFieldArrayRemove, useFormContext, useWatch } from 'react-hook-form';
import { getLocations } from 'services';
import { Company, SetState } from 'types';

export const useCompany = (
  remove: UseFieldArrayRemove,
  setRemovedItems: SetState<number[]> | undefined,
  id: number | undefined,
  index: number,
) => {
  const { getValues, setValue } = useFormContext();

  const removeHandler = (i: number) => {
    const newState: Company[] = [...getValues('experiences')];
    newState.splice(i, 1);
    remove(i);
    id && setRemovedItems?.((prev) => prev.concat(+id!));
    setValue('experiences', newState, {
      shouldDirty: true,
    });
  };
  const current = useWatch({ name: `experiences.${index}.current` });
  const endDate = useWatch({ name: `experiences.${index}.end_date` });
  const startDate = useWatch({ name: `experiences.${index}.start_date` });

  const locationSearch = useDebouncedSearch({
    selectedValue: useWatch({ name: `experiences.${index}.location` }),
    fetchItems: async (query) => {
      const response = await getLocations(getCookie('token'), query);
      return response.map((item) =>
        item.country ? `${item.city}, ${item.country.country}` : `${item.city}`,
      );
    },
    emptyText: 'Start typing to search for locations.',
    noResultsText: 'No locations found.',
  });

  return {
    removeHandler,
    getValues,
    current,
    endDate,
    startDate,
    locationSearch,
    setValue,
  };
};
