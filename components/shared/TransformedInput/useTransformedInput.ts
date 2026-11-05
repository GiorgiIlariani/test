'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

export const useTransformedInput = (
  inputName: string,
  registerOptions?: RegisterOptions,
  externalOnChange?: (e?: ChangeEvent<HTMLInputElement>) => void,
  blurHandler?: (e?: ChangeEvent<HTMLInputElement>) => void,
) => {
  const { register, getValues, setValue } = useFormContext();

  const [customButtonOndEditMode, setCustomButtonOnEditMode] = useState(false);

  const { ref, ...registerValues } = register(inputName, {
    ...registerOptions,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      externalOnChange?.(e);
    },
    onBlur(e) {
      blurHandler?.(e);
      setCustomButtonOnEditMode(false);
    },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const toggleCustomButton = () => {
    setCustomButtonOnEditMode(true);
    if (!getValues(inputName)) {
      inputRef.current!.value = '';
      setValue(inputName, '');
    }
    inputRef.current?.focus();
  };

  const isInputFocused = inputRef.current === document.activeElement;

  return {
    register,
    inputRef,
    ref,
    registerValues,
    getValues,
    customButtonOndEditMode,
    toggleCustomButton,
    isInputFocused,
  };
};
