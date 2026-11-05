'use client';

import { addClickAwayHandler, getErrorMessage } from 'helpers';
import { useState, useRef, useEffect, MouseEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Props } from './types';

export const useAdvancedSelect = (
  data: Props['list'],
  inputName: string,
  noSearch?: boolean,
  externalSearchHandler?: Props['externalSearchHandler'],
  initialListData?: Props['initialList'],
  firstRowIsDesc?: Props['firstRowIsDesc'],
  searchOnChange?: Props['searchOnChange'],
  resetLists?: Props['resetLists'],
  isIdString?: Props['isIdString'],
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialList, setInitialList] = useState(initialListData ?? data);
  const [list, setList] = useState(data);
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
    if (!initialList.length || !list.length) {
      setInitialList(initialListData ?? data);
      setList(data);
    }
    if (resetLists) {
      setList(data);
      setInitialList(data);
    }
  }, [data, initialListData]);

  const renderDefaultValue = () => {
    if (!noSearch && getValues(inputName)) {
      if (typeof getValues(inputName) === 'number' || isIdString) {
        const value = (initialList as { id: number; title: string }[]).find(
          (item) => item.id === getValues(inputName),
        );
        if (value) searchRef.current!.value = value?.title!;

        setValue(inputName, value?.id);
      } else if (searchOnChange) {
        searchRef.current!.value = getValues(inputName)?.title;
        setValue(inputName, getValues(inputName));
      } else {
        searchRef.current!.value = getValues(inputName);
        setValue(inputName, getValues(inputName));
      }
      setCustomButtonOnEditMode?.(false);
    }
  };

  const dropdownToggler = (e?: MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen, () => renderDefaultValue());
    noSearch ? setIsOpen((prev) => !prev) : setIsOpen(true);
  };

  const dropDownChevron = () => {
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    setIsOpen((prev) => !prev);
  };

  const toggleCustomButton = () => {
    setList(initialList);
    setCustomButtonOnEditMode(true);

    if (!noSearch) {
      searchRef.current!.value = '';
      searchRef.current?.focus();
    }

    dropdownToggler();
  };

  const searchInDropdownHandler = (query: string) => {
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    setIsOpen(true);

    if (!query) return setList(initialList);

    if (externalSearchHandler) return externalSearchHandler(query, setList);

    setList(
      (initialList as { id: number; title: string }[]).filter((item) =>
        item.title?.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  const errorMessage = getErrorMessage(errors, inputName);

  return {
    list: firstRowIsDesc ? [{ title: firstRowIsDesc }].concat(list as any) : list,
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
    customButtonOndEditMode,
    setCustomButtonOnEditMode,
    toggleCustomButton,
    errorMessage,
    isErrorIconHovered,
    setIsErrorIconHovered,
    dropDownChevron,
  };
};
