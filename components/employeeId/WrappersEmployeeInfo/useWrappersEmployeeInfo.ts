'use client';

import { GlobalApiInfo } from 'context';
import { useContext } from 'react';
import { Props } from './types';

export const useWrappersEmployeeInfo = (refetch: Props['refetch'], employee: Props['employee']) => {
  const { refetchUser, user } = useContext(GlobalApiInfo);

  const handleAvatarChange = () => {
    if (user?.id === employee?.id) refetchUser();

    refetch?.();
  };

  return {
    handleAvatarChange,
  };
};
