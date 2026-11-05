'use client';

import { Props } from './types';
import { addClickAwayHandler } from 'helpers';
import { useRef, useState } from 'react';

export const useYearsDropDown = (props: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const defaultYearList =
    props.page === 'Time offs'
      ? [currentYear - 1, currentYear, currentYear + 1]
      : [currentYear, currentYear + 1];
  const listOfYears = props.listOfYears || defaultYearList;
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const openModalHandler = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setModalIsOpen);
    setModalIsOpen(!modalIsOpen);
  };

  return {
    modalIsOpen,
    setModalIsOpen,
    openModalHandler,
    buttonRef,
    dropDownRef,
    listOfYears,
  };
};
