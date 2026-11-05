'use client';

import { addClickAwayHandler, can } from 'helpers';
import { useParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Permission } from 'types';

export const useProjectPlanNav = (permissions: Permission[]) => {
  const params = useParams();

  const [isBurgerClicked, setIsBurgerClicked] = useState(false);

  const listItem = useCallback(
    (key: string, label: string) => ({
      key,
      label,
      href: `/projects/${params.project?.[0]}/${key}`,
      isActive: params.project?.includes(key),
      show: key !== 'invoices' && key !== 'timesheets',
    }),
    [params],
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLUListElement>(null);

  const togglePhase = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setIsBurgerClicked);
    setIsBurgerClicked(true);
  };

  const navList = () => [
    listItem('dashboard', 'Dashboard'),
    listItem('plan', 'Project plan'),

    ...(can('project-invoice::list', permissions) ? [listItem('invoices', 'Invoices')] : []),

    listItem('timesheets', 'Timesheets'),
  ];

  return { navList, params, togglePhase, isBurgerClicked, buttonRef, dropDownRef };
};
