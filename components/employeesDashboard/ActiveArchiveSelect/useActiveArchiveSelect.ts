'use client';

import { getCookie } from 'cookies-next';
import { CookieValueTypes } from 'cookies-next/lib/types';
import { analytics } from 'helpers';
import { getDashboardUsers } from 'services';
import { EmployeeFilterAndSortReducerDispatch, SetState } from 'types';
import { ArchiveFilter } from './types';

export const useActiveArchiveSelect = (
  setActiveArchive: SetState<string[]>,
  activeArchive: string[],
  dispatchEmployeeInfo: EmployeeFilterAndSortReducerDispatch,
  setArchiveActiveIsLoading: SetState<boolean>,
  archiveActiveIsLoading: boolean,
) => {
  const changeDashboardUsers = async (
    token: CookieValueTypes,
    dispatch: EmployeeFilterAndSortReducerDispatch,
    filter: string[],
  ) => {
    setArchiveActiveIsLoading(true);
    const activeResult = filter.includes('active') ? 1 : 0;
    const archiveResult = filter.includes('inactive') ? 1 : 0;
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?inactive=${archiveResult}&active=${activeResult}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    const res = await getDashboardUsers(token, {
      active: activeResult,
      archived: archiveResult,
    });
    dispatch({
      payload: {
        initialEmployees: res.data,
        employeeTypeFilter: {
          employee: true,
          freelancer: false,
          preOffer: false,
        },
      },
      type: 'ARCHIVE_AND_ACTIVE_EMPLOYEES',
    });
    setArchiveActiveIsLoading(false);
  };

  const getDropdownText = () => {
    if (activeArchive.length === 1) {
      return activeArchive.at(-1) === 'active' ? 'active' : 'inactive';
    } else {
      return 'Active, Inactive';
    }
  };

  const handleActiveArchiveChange = (filter: ArchiveFilter, checked: boolean) => {
    if (archiveActiveIsLoading) return;

    const nextFilters = checked
      ? [...new Set([...activeArchive, filter])]
      : activeArchive.filter((value) => value !== filter);

    if (nextFilters.length === 0) return;

    analytics.track(`Resources - dropdown ${filter}`);

    if (checked) {
      analytics.track(
        `Employee Dashboard - Filtered by ${filter === 'active' ? 'Active' : 'Inactive'}`,
      );
    }

    setActiveArchive(nextFilters);

    void changeDashboardUsers(getCookie('token'), dispatchEmployeeInfo, nextFilters);
  };

  const onlyActiveSelected = activeArchive.length === 1 && activeArchive.includes('active');

  const onlyInactiveSelected = activeArchive.length === 1 && activeArchive.includes('inactive');

  return {
    getDropdownText,
    handleActiveArchiveChange,
    onlyActiveSelected,
    onlyInactiveSelected,
  };
};
