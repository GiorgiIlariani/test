'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';

export const useEmployeeDropDown = () => {
  const [projectIsDropped, setProjectIsDropped] = useState(false);
  const router = useRouter();
  return { projectIsDropped, setProjectIsDropped, router };
};
