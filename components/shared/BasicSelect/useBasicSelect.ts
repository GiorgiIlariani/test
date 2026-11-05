'use client';
import { addClickAwayHandler, getErrorMessage } from 'helpers';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Props } from './types';

export const useBasicSelect = (
  data: string[],
  inputName: string,
  onChangeHandler?: Props['onChangeHandler'],
  noSearch?: boolean,
  externalSearchHandler?: Props['externalSearchHandler'],
  isBackendSearch?: Props['isBackendSearch'],
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialList, setInitialList] = useState<string[]>(data);
  const [list, setList] = useState<string[]>(data);
  const [customButtonOndEditMode, setCustomButtonOnEditMode] = useState(false);
  const [isErrorIconHovered, setIsErrorIconHovered] = useState(false);

  const {
    formState: { errors },
    setValue,
    getValues,
    register,
    clearErrors,
  } = useFormContext();

  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInitialList(data);
    !noSearch && setList(data);
  }, [data]);

  const renderDefaultValue = () => {
    if (!noSearch && !isBackendSearch) {
      const value = initialList.find((item) => item === getValues(inputName));
      if (value) searchRef.current!.value = value;
      setValue(inputName, value);
      setCustomButtonOnEditMode?.(false);
    }
  };

  const toggleCustomButton = () => {
    setList(initialList);

    setCustomButtonOnEditMode(true);
    if (!noSearch && !isBackendSearch) {
      searchRef.current!.value = '';
      searchRef.current?.focus();
    }
    dropdownToggler();
  };

  const dropdownToggler = () => {
    setIsOpen((prev) => !prev);
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen, () => renderDefaultValue());
  };

  const searchInDropdownHandler = (query: string, e: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    onChangeHandler?.(e.target.value);

    if (!query) return setList(initialList);

    if (externalSearchHandler) return externalSearchHandler(query, setList);

    setList(initialList.filter((item) => item.toLowerCase().includes(query.toLowerCase())));
  };
  const errorMessage = getErrorMessage(errors, inputName);

  return {
    list,
    errors,
    dropdownToggler,
    searchInDropdownHandler,
    setValue,
    getValues,
    buttonRef,
    dropdownRef,
    searchRef,
    isOpen,
    setIsOpen,
    register,
    clearErrors,
    setList,
    toggleCustomButton,
    customButtonOndEditMode,
    setCustomButtonOnEditMode,
    errorMessage,
    isErrorIconHovered,
    setIsErrorIconHovered,
  };
};
