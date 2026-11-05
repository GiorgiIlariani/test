'use client';

import { CHANGING_WORDS } from 'helpers';
import { useEffect, useRef, useState } from 'react';

export const useToolieLandingHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        return prev + 1 === CHANGING_WORDS.length ? 0 : prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return { activeIndex };
};
