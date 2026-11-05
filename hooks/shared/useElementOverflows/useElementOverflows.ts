'use client';

import { isOverflown } from 'helpers';
import { useLayoutEffect, useRef, useState } from 'react';

export const useElementOverflows = <T extends Element>() => {
  const [elementOverflows, setElementOverflows] = useState(false);
  const elementRef = useRef<T>(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      setElementOverflows(isOverflown(elementRef.current));
    }
  }, []);

  return [elementOverflows, elementRef] as const;
};
