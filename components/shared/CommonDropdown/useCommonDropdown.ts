'use client';

import { addClickAwayHandler } from 'helpers';
import { useRef } from 'react';
import { SetState } from 'types';

export const useCommonDropdown = (setModalIsOpen: SetState<boolean>) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const openModalHandler = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setModalIsOpen);
    setModalIsOpen((prev) => !prev);
  };
  return { openModalHandler, buttonRef, dropDownRef };
};
