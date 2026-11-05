'use client';

import { useState } from 'react';

export const useTimeOffTableItem = () => {
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const toggleDropdownIsOpen = () => setDropdownIsOpen(!dropdownIsOpen);

  return {
    dropdownIsOpen,
    setDropdownIsOpen,
    toggleDropdownIsOpen,
  };
};
