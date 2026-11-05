'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { analytics, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useReducer, useState } from 'react';
import { getDashboardUsers } from 'services';
import { employeeFilterAndSortReducer } from 'store';
import { EmployeeFilterAndSortReducerDispatch, FilterOptions } from 'types';
import { EmployeeFilterType } from 'types/employeeDashboard';

export const useIndexPage = (serverSideFilters: FilterOptions[]) => {
  const { skills, departments, rawSeniorities, positions, setDelay } = useContext(GlobalApiInfo);
  const router = useRouter();

  const [employeesInfo, dispatchEmployeeInfo] = useReducer(employeeFilterAndSortReducer, {
    employees: [],
    initialEmployees: [],
    filterOptions: serverSideFilters,
    employeeTypeFilter: {
      employee: true,
      freelancer: false,
      preOffer: false,
    },
  });

  const [employeesAreLoading, setEmployeesAreLoading] = useState(true);
  const [notResponseError, setNotResponseError] = useState(false);
  const [inviteUserModalIsOpen, setInviteUserModalIsOpen] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setEmployeesAreLoading(true);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  const toggleInviteUserModal = () => {
    analytics.track('Resources - Plus button');
    !inviteUserModalIsOpen && analytics.track('Employee Dashboard - Invite New User');
    setInviteUserModalIsOpen((prev) => !prev);
  };
  const getUsers = async () => {
    try {
      const queryActive =
        typeof router.query.active === 'undefined' ? undefined : router.query.active;
      let active: 1 | 0 = Number(queryActive) ? 1 : 0;
      if (typeof queryActive === 'undefined') {
        active = 1;
      }
      const archived = Number(router.query.inactive) ? 1 : 0;
      const res = await getDashboardUsers(getCookie('token'), {
        active,
        archived,
      });

      (dispatchEmployeeInfo as EmployeeFilterAndSortReducerDispatch)({
        payload: {
          initialEmployees: res.data,
          employeeTypeFilter: {
            employee: false,
            freelancer: false,
            preOffer: false,
          },
        },
        type: 'HANDLE_PAGE_CHANGE',
      });
    } catch (error: any) {
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    } finally {
      setEmployeesAreLoading(false);
      setDelay(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, [router, setDelay]);

  const employeeTypeChangeHandler = (
    employeeType: 'employee' | 'freelancer' | 'preOffer',
    isEmployeeTypeChecked: boolean,
  ) => {
    (dispatchEmployeeInfo as EmployeeFilterAndSortReducerDispatch)({
      payload: {
        initialEmployees:
          employeesInfo.initialEmployees.length === 0
            ? employeesInfo.employees
            : employeesInfo.initialEmployees,
        employeeTypeFilter: {
          ...employeesInfo.employeeTypeFilter,
          [employeeType]: isEmployeeTypeChecked,
        } as EmployeeFilterType,
      },
      type: 'FILTER_EMPLOYEES',
    });
    localStorage.setItem(
      'employee_filter',
      JSON.stringify({
        ...employeesInfo.employeeTypeFilter,
        [employeeType]: isEmployeeTypeChecked,
      }),
    );
  };

  const filterProps = {
    employeeTypeChangeHandler,
    employeesInfo,
  };

  return {
    skills,
    departments,
    rawSeniorities,
    positions,
    employeesInfo,
    dispatchEmployeeInfo,
    employeesAreLoading,
    setEmployeesAreLoading,
    filterProps,
    notResponseError,
    setNotResponseError,
    toggleInviteUserModal,
    inviteUserModalIsOpen,
    setInviteUserModalIsOpen,
    getUsers,
  };
};
