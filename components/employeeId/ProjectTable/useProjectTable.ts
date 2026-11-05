'use client';

import { useFormContext } from 'react-hook-form';

export const useProjectTable = () => {
  const { getValues } = useFormContext();
  return { getValues };
};
