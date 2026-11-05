'use client';

import { addClickAwayHandler } from 'helpers';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const useBookModalPhaseItem = () => {
  const [isActionsClicked, setIsActionsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { getValues, setValue } = useFormContext();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const togglePhase = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setIsActionsClicked);
    setIsActionsClicked(true);
  };
  return {
    togglePhase,
    isActionsClicked,
    buttonRef,
    dropDownRef,
    getValues,
    isHovered,
    setIsHovered,
    setIsActionsClicked,
    setValue,
  };
};
