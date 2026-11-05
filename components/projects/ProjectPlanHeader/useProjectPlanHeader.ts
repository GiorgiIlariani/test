'use client';

import { addClickAwayHandler, can } from 'helpers';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Permission } from 'types';

export const useProjectPlanHeader = (
  setDeleteDialog: Dispatch<SetStateAction<boolean>>,
  permissions: Permission[],
) => {
  const router = useRouter();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const moreOptionDropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDropdown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    addClickAwayHandler(triggerRef, moreOptionDropdownRef, setIsOpen);
    setIsOpen(true);
  };

  const canUpdate = can('project::update', permissions);
  const canDelete = can('project::delete', permissions);

  const dropDownList = [
    canUpdate
      ? {
          title: 'Edit project',
          onClick: () =>
            router.replace(
              { pathname: router.pathname, query: { ...router.query, addProject: '1' } },
              undefined,
              { shallow: true },
            ),
        }
      : null,
    canDelete
      ? {
          title: 'Delete project',
          onClick: () => setDeleteDialog(true),
        }
      : null,
  ].filter((item) => item !== null);

  return {
    dropDownList,
    triggerRef,
    moreOptionDropdownRef,
    isOpen,
    setIsOpen,
    openDropdown,
  };
};
