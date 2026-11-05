'use client';
import { addClickAwayHandler } from 'helpers';
import { useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const useMultiSelectDropdown = (inputName: string, disabled?: boolean) => {
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext();

  const selected: string[] = useWatch({ name: inputName, control }) || [];

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const toggleDropdown = (e: any) => {
    if (disabled || dropdownRef.current?.contains(e.target as Node)) return;

    setIsOpen((prev) => !prev);
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen, undefined, undefined, true);
  };

  const toggleItem = (item: string) => {
    if (disabled) return;

    const updated = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];

    setValue(inputName, updated, { shouldValidate: true });
    clearErrors(inputName);
  };

  const removeItem = (item: string) => {
    if (disabled) return;

    const updated = selected.filter((i) => i !== item);
    setValue(inputName, updated, { shouldValidate: true });
  };

  return {
    register,
    setValue,
    getValues,
    clearErrors,
    errors,
    isOpen,
    removeItem,
    toggleItem,
    toggleDropdown,
    buttonRef,
    dropdownRef,
    selected,
    setIsOpen,
  };
};
