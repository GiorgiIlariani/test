import { useState } from 'react';
import { ListType } from 'types';

export const useConfigSectionSearch = (items: ListType[]) => {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const visibleItems = items.filter((item) =>
    (item.title || 'Untitled').toLowerCase().includes(query),
  );

  return { search, setSearch, visibleItems };
};
