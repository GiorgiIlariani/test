'use client';

import { GlobalApiInfo } from 'context';
import { can } from 'helpers';
import { useContext, useState } from 'react';

export const useProfileInfoSectionWrapper = (
  employeeId: number,
  isEmpty: boolean,
  canNotEdit?: boolean,
) => {
  const [isOpen, setIsOpen] = useState(!isEmpty);

  const { user } = useContext(GlobalApiInfo);

  const canEdit = () => {
    return (
      (can('employee::update', user?.permissions) ||
        (can('employee::self-update', user?.permissions) && user.id === employeeId)) &&
      !canNotEdit
    );
  };

  const canReorder = () => {
    return (
      can('user-data:reorder', user?.permissions) ||
      (can('employee::self-update', user?.permissions) && user.id === employeeId)
    );
  };

  return { canEdit, isOpen, setIsOpen, canReorder };
};
