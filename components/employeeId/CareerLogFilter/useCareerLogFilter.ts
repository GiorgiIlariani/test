'use client';

import { addClickAwayHandler, analytics } from 'helpers';
import { useState, useRef } from 'react';

export const useCareerLogFilter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownToggler = () => {
    analytics.track(`Career Log - Options Filter Opened`);
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    dropdownToggler,
    buttonRef,
    dropdownRef,
  };
};
