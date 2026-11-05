'use client';

import { useEffect, useRef, useState } from 'react';

export const useObserver = <T extends Element>({
  animationStart,
  animationEnd,
}: {
  animationStart?: string[];
  animationEnd?: string[];
} = {}) => {
  const ref = useRef<T>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (hasAnimated) return;

      if (entry.isIntersecting) {
        entry.target.classList.add(...(animationStart || ['end-animation']));
        entry.target.classList.remove(...(animationEnd || ['start-animation']));
        setHasAnimated(true);
      } else {
        entry.target.classList.add(...(animationEnd || ['start-animation']));
        entry.target.classList.remove(...(animationStart || ['end-animation']));
        setHasAnimated(false);
      }
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, animationStart, animationEnd]);
  return { ref };
};
