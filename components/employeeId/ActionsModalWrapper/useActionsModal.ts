'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export const useActionsModal = () => {
  const { handleSubmit } = useFormContext();

  useEffect(() => {
    const body = document.body;
    if (body) {
      body!.style.overflow = 'hidden';
    }
    return () => {
      body!.style.overflow = 'auto';
    };
  }, []);

  return { handleSubmit };
};
