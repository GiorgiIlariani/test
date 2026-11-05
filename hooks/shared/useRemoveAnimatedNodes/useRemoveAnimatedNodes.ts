'use client';

import { useEffect, useState } from 'react';

export const useRemoveAnimatedNodes = ({
  condition = false,
  duration = 500,
  remove = 'hidden',
  display = 'block',
  style = ['opacity-0', 'opacity-100'],
}) => {
  const [removeNodes, setRemoveNodes] = useState<string>('hidden');
  const [hide, show] = style;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!condition) {
      setRemoveNodes(`${hide}`);
      timeout = setTimeout(() => setRemoveNodes(`${remove} ${hide}`), duration);
      return () => clearTimeout(timeout);
    }
    setRemoveNodes(`${display} ${hide}`);
    timeout = setTimeout(() => setRemoveNodes(`${display} ${show}`), 0);

    return () => clearTimeout(timeout);
  }, [condition, duration, hide, show, display, remove]);

  return { removeNodes };
};
