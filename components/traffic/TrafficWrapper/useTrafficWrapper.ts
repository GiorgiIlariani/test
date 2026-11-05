'use client';

import { addClickAwayHandler, analytics } from 'helpers';
import { useRef, useState } from 'react';

export const useTrafficWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dateFilterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      analytics.track('Traffic - Date Filter');
      setIsOpen(true);
      addClickAwayHandler(buttonRef, dateFilterRef, setIsOpen);
    }
  };

  return {
    isOpen,
    toggleOpen,
    dateFilterRef,
    buttonRef,
  };
};
