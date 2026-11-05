'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '../useDebounce';
import { toastGeneralError } from 'helpers';
import { OnInputValueChange, UseDebouncedSearchOptions } from './types';

export function useDebouncedSearch({
  selectedValue,
  fetchItems,
  delay,
  emptyText = 'Start typing to search.',
  searchingText = 'Searching...',
  noResultsText = 'No items found.',
}: UseDebouncedSearchOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, delay);
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fetchItemsRef = useRef(fetchItems);
  fetchItemsRef.current = fetchItems;

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setIsSearching(false);
      return;
    }

    const fetch = async () => {
      try {
        const response = await fetchItemsRef.current(debouncedQuery);
        setResults(response);
      } catch (error: any) {
        toastGeneralError(error);
      } finally {
        setIsSearching(false);
      }
    };

    fetch();
  }, [debouncedQuery]);

  const onInputValueChange: OnInputValueChange = useCallback((val, { reason }) => {
    if (reason === 'input-change') {
      setSearchQuery(val);
      setResults([]);
      setIsSearching(val.trim().length > 0);
    } else {
      setSearchQuery('');
      setIsSearching(false);
    }
  }, []);

  return {
    inputValue: searchQuery || selectedValue || '',
    items: results,
    onInputValueChange,
    emptyText: !searchQuery.trim() ? emptyText : isSearching ? searchingText : noResultsText,
  };
}
