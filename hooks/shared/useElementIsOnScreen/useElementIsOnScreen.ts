'use client';

import { RefObject, useEffect, useState } from 'react';

export const useElementIsOnScreen = (ref: RefObject<any>, alreadyShowed?: boolean) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
    if (ref.current) {
      observer.observe(ref.current);
    }
    if (alreadyShowed) {
      observer.disconnect();
    }
    return () => {
      observer.disconnect();
    };
  }, [ref, alreadyShowed]);

  return isIntersecting;
};
