'use client';

import { addClickAwayHandler } from 'helpers';
import { useRef, useState } from 'react';

export const useVacationModalEdit = () => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    if (!isOpen) {
      addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    }
    setIsOpen(!isOpen);
  };

  return {
    toggleOpen,
    isOpen,
    buttonRef,
    dropdownRef,
    setIsOpen,
  };
};
