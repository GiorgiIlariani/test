'use client';

import { ChangeEvent, RefObject } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

export const useInputWithRef = (
  inputName: string,
  inputRef: RefObject<HTMLInputElement | null>,
  registerOptions?: RegisterOptions,
  externalOnChange?: (e?: ChangeEvent<HTMLInputElement>) => void,
  blurHandler?: (e?: ChangeEvent<HTMLInputElement>) => void,
) => {
  const { register, getValues } = useFormContext();

  const { ref, ...registerValues } = register(inputName, {
    ...registerOptions,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      externalOnChange?.(e);
    },
    onBlur(e) {
      blurHandler?.(e);
    },
  });

  return {
    register,
    inputRef,
    ref,
    registerValues,
    getValues,
  };
};
