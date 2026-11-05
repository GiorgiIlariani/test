'use client';

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Props } from './types';

export const useInputWithFollowingSignAtEnd = (
  inputName: Props['inputName'],
  doNotCutSize: Props['doNotCutSize'],
  placeholder: Props['placeholder'],
  allowFloats: Props['allowFloats'],
) => {
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext();
  const [width, setWidth] = useState(0);

  const inputValue = useWatch({
    name: inputName,
  });
  const measureSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (measureSpanRef.current) {
      measureSpanRef.current.innerText = inputValue == '0' || inputValue ? inputValue : placeholder;
      setWidth(measureSpanRef.current.getBoundingClientRect().width);
    }
  }, [inputValue, placeholder]);

  const changeAndBlurHandler = (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLInputElement>,
  ) => {
    if (allowFloats) return;
    let freshValueCopy = event.currentTarget.value;
    setValue(inputName, freshValueCopy);

    if (freshValueCopy.length > 3 && !doNotCutSize) {
      event.currentTarget.value = freshValueCopy.slice(0, -1);
      freshValueCopy = event.currentTarget.value;
    }
  };

  return {
    changeAndBlurHandler,
    measureSpanRef,
    inputValue,
    width,
    register,
    errors,
  };
};
