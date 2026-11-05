'use client';

import { GlobalApiInfo } from 'context';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

export const useCareerChangeShowModalCTA = () => {
  const { getValues } = useFormContext();
  const { user } = useContext(GlobalApiInfo);
  const router = useRouter();
  return { getValues, router, user };
};
