'use client';

import { addClickAwayHandler } from 'helpers';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const useCvEditDropdown = () => {
  const { register, setValue, getValues } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownToggler = () => {
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    setIsOpen((prev) => !prev);
  };

  return {
    dropdownToggler,
    isOpen,
    buttonRef,
    dropdownRef,
    register,
    setValue,
    getValues,
  };
};
