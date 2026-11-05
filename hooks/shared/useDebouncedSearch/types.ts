import type { Combobox } from 'components';
import type { ComponentPropsWithoutRef } from 'react';

export type OnInputValueChange = NonNullable<
  ComponentPropsWithoutRef<typeof Combobox>['onInputValueChange']
>;

export type UseDebouncedSearchOptions = {
  selectedValue: string | null;
  fetchItems: (query: string) => Promise<string[]>;
  delay?: number;
  emptyText?: string;
  searchingText?: string;
  noResultsText?: string;
};
