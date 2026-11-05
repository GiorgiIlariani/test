'use client';

import { addClickAwayHandler } from 'helpers';
import { useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const useEditableIncomeStatementInput = (month: number, inputName: string) => {
  const { register, getValues, setValue, resetField } = useFormContext();
  const value = useWatch({
    name: `${inputName}.${month}.price`,
  });

  const [previousValue, setPreviousValue] = useState({
    ...getValues(`${inputName}.${month}`),
  });

  const triggerRef = useRef(null);
  const divRef = useRef(null);
  const [navBtnIsOpen, setNavBtnIsOpen] = useState(false);

  const resetFieldsOnBlur = () => {
    if (!getValues(`${inputName}.${month}.id`)) {
      setValue(`${inputName}.${month}.price`, null);
    }
  };

  const toggleInput = () => {
    setNavBtnIsOpen((prev) => !prev);
    addClickAwayHandler(triggerRef, divRef, setNavBtnIsOpen);
  };

  return {
    register,
    navBtnIsOpen,
    setNavBtnIsOpen,
    triggerRef,
    divRef,
    toggleInput,
    getValues,
    resetFieldsOnBlur,
    setValue,
    resetField,
    value,
    previousValue,
    setPreviousValue,
  };
};
