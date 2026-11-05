'use client';

import { RefObject, useCallback, useEffect, useRef } from 'react';

export const useClickOutSide = <T extends HTMLElement>({
  cb,
  externalRef,
  selectRef,
}: {
  cb: () => void;
  selectRef?: RefObject<T>;
  externalRef?: RefObject<T>;
}) => {
  const ref = useRef<HTMLDivElement & T>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (
        !(externalRef || ref).current?.contains(e.target as Node) &&
        !selectRef?.current?.contains(e.target as Node)
      )
        cb();
    },
    [ref, externalRef, selectRef],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [handleClickOutside]);

  return ref;
};
