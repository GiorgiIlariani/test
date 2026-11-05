'use client';

import { WELCOME_MESSAGE } from 'config';
import { setCookie } from 'cookies-next';
import { addClickAwayHandler, addHours } from 'helpers';
import { useRef, useState } from 'react';

export const useWelcomeMessage = (welcomeMessageIsNew: boolean) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldJakeAnimate, SetShouldJakeAnimate] = useState(welcomeMessageIsNew);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const openMessage = () => {
    const date = new Date();
    addHours(date, 365 * 24);
    setCookie('welcome-message', JSON.stringify(WELCOME_MESSAGE), {
      expires: date,
    });
    setIsOpen(true);
    SetShouldJakeAnimate(false);
    addClickAwayHandler(buttonRef, messageRef, setIsOpen);
  };

  const closeMessage = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    openMessage,
    closeMessage,
    shouldJakeAnimate,
    messageRef,
    buttonRef,
  };
};
