'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';

export const useProjectDashboardListItem = () => {
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const [isPhaseHovered, setIsPhaseHovered] = useState(false);
  const router = useRouter();

  return {
    isProgressHovered,
    setIsProgressHovered,
    isPhaseHovered,
    setIsPhaseHovered,
    router,
  };
};
