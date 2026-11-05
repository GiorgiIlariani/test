import { addClickAwayHandler } from 'helpers';
import { useRef, useState } from 'react';

export const useDateFilter = () => {
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    if (isDateFilterOpen) {
      setIsDateFilterOpen(false);
    } else {
      setIsDateFilterOpen(true);
      addClickAwayHandler(buttonRef, dateDropdownRef, setIsDateFilterOpen);
    }
  };

  return { buttonRef, dateDropdownRef, isDateFilterOpen, toggleOpen };
};
