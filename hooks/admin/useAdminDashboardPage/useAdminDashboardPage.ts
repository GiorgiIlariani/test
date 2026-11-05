'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useReducer, useState } from 'react';
import { getPrivilegedUsersListRequest } from 'services';
import {
  AllSubCategories,
  FilterOptions,
  PrivilegedUserEditFormFields,
  PrivilegedUsers,
  UserManagementDashboardFilterReducerDispatch,
} from 'types';
import { useRouter } from 'next/router';
import {
  capitalizeFirstLetter,
  getAllSubCategories,
  getUniqueObjectsById,
  toastGeneralError,
} from 'helpers';
import { userManagementDashboardReducer } from 'store';

export const useAdminDashboardPage = (
  roles: { id: number; name: string }[],
  filter: FilterOptions[],
) => {
  const router = useRouter();
  const statusQuery = router.query?.status as string;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(statusQuery ? statusQuery?.split(',') : ['active']);
  const [notResponseError, setNotResponseError] = useState(false);

  const [userManagementReducer, dispatchUserManagement] = useReducer(
    userManagementDashboardReducer,
    {
      filterOptions: filter ?? [],
      userManagementDashboard: [],
      initialUserManagementDashboard: [],
    },
  );

  const setUsersState = (
    userId: number,
    roles?: { id: number; name: string }[],
    data?: PrivilegedUserEditFormFields,
    updating?: boolean,
  ) => {
    updating
      ? (dispatchUserManagement as UserManagementDashboardFilterReducerDispatch)({
          type: 'CHANGE_USER_MANAGEMENT',
          payload: {
            userId,
            roles,
            data,
          },
        })
      : (dispatchUserManagement as UserManagementDashboardFilterReducerDispatch)({
          type: 'DELETE_USER',
          payload: {
            userId,
          },
        });
  };

  const [inviteUserModalIsOpen, setInviteUserModalIsOpen] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await getPrivilegedUsersListRequest(getCookie('token'));
      (dispatchUserManagement as UserManagementDashboardFilterReducerDispatch)({
        type: 'GET_USER_MANAGEMENT',
        payload: {
          initialUserManagementDashboard: response.data.data,
          userManagementDashboard: response.data.data,
          status,
        },
      });
    } catch (error: any) {
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [router]);

  const [subCategories, setAllSubCategories] = useState<AllSubCategories[]>(
    getAllSubCategoriesForFilter(),
  );

  function getAllSubCategoriesForFilter() {
    return getAllSubCategories(
      {
        array: getUniqueObjectsById(
          userManagementReducer.userManagementDashboard?.map((user: PrivilegedUsers) => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
          })),
        ),
        type: 'employee',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array: roles.map((role) => ({
          id: role.name,
          name: capitalizeFirstLetter(role.name),
        })),
        shouldDefaultToAndInInsideCondition: false,
        type: 'role',
        filter_type: 'select',
      },
      {
        array: getUniqueObjectsById(
          userManagementReducer.userManagementDashboard?.map((user: PrivilegedUsers) => ({
            id: user.id,
            title: user.email,
          })),
        ),
        shouldDefaultToAndInInsideCondition: false,
        type: 'email',
        filter_type: 'select',
      },
    );
  }

  const filterUsers = (status: string[]) => {
    const newUrl = `${window.location.origin}${window.location.pathname}${
      router.query.filter ? `?filter=${router.query.filter}&` : '?'
    }status=${status}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    (dispatchUserManagement as UserManagementDashboardFilterReducerDispatch)({
      type: 'FILTER_USER',
      payload: {
        status: status,
      },
    });
  };

  return {
    userManagementReducer,
    dispatchUserManagement,
    subCategories,
    setAllSubCategories,
    getAllSubCategoriesForFilter,
    setUsersState,
    loading,
    filterUsers,
    status,
    setStatus,
    notResponseError,
    setNotResponseError,
    inviteUserModalIsOpen,
    setInviteUserModalIsOpen,
    getUsers: getData,
  };
};
