'use client';

import { addClickAwayHandler, analytics } from 'helpers';
import { useRouter } from 'next/router';
import { ChangeEvent, useRef } from 'react';
import { FilterState, SetState } from 'types';

export const useProjectsStatusFilter = (
  filterState: FilterState,
  setFilterState: SetState<FilterState>,
  setIsOpen: SetState<boolean>,
  updateProjectFilterState?: (newState: FilterState) => void,
) => {
  const router = useRouter();
  const query = (router.query?.state as string)?.split('-');

  const stateHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const isChecked = e.target.checked;
    const updatedFilterState = { ...filterState, [name]: isChecked };
    const checkedKeys = Object.keys(updatedFilterState).filter((key) => updatedFilterState[key]);
    if (!checkedKeys.length) {
      return;
    }
    if (isChecked) {
      analytics.track(`Projects - ${name} checked`);
    }

    setFilterState((prev) => {
      const newFilterState = {
        ...prev,
        [name]: isChecked,
      };

      updateProjectFilterState?.(newFilterState);

      return newFilterState;
    });

    const newQuery = { ...router.query };
    if (checkedKeys.length) {
      newQuery.filterBy = checkedKeys.join(',');
    } else {
      delete newQuery.filterBy;
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const toggleStatusFilter = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setIsOpen);
    setIsOpen((prev) => !prev);
  };

  return {
    stateHandler,
    router,
    query,
    buttonRef,
    dropDownRef,
    toggleStatusFilter,
  };
};
