'use client';

import { SetState } from 'types';

export const useUserManagementFilterDropdown = (
  filterUsers: (status: string[]) => void,
  status: string[],
  setStatus: SetState<string[]>,
) => {
  const handleStatusChange = (value: string, checked: boolean) => {
    const nextStatus = checked
      ? [...new Set([...status, value])]
      : status.filter((item) => item !== value);

    if (nextStatus.length === 0) return;

    setStatus(nextStatus);
    filterUsers(nextStatus);
  };

  const isLastSelected = (value: string) => status.length === 1 && status.includes(value);

  return { handleStatusChange, isLastSelected };
};
