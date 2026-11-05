'use client';

import { useCallback, useEffect } from 'react';

const KEY = 'Escape';
const EVENT = 'keyup';

export const useEsc = (handleClose: () => void) => {
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KEY) {
        handleClose();
      }
    },
    [handleClose],
  );

  useEffect(() => {
    document.addEventListener(EVENT, handleEscKey, false);

    return () => {
      document.removeEventListener(EVENT, handleEscKey, false);
    };
  }, [handleEscKey]);
};
