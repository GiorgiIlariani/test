'use client';
import { useEffect, useRef, useState } from 'react';
import { Props } from './types';

export const usePortalWrapper = (
  setMountedProps?: Props['setMounted'],
  className?: Props['className'],
) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const portal = document.createElement('div');
    portal.setAttribute('id', 'modal_portal');
    className && portal.classList.add('fixed', 'inset-0', 'z-9999', ...className.split(' '));

    document.querySelector<HTMLElement>('body')!.append(portal);
    document.body.style.overflow = 'hidden';
    ref.current = portal;
    setMounted(true);
    setMountedProps?.(true);

    return () => {
      portal.remove();
      document.body.style.overflow = '';
    };
  }, []);

  return { mounted, ref };
};
