'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActionTypes,
  EmployeeFilterAndSortReducerDispatch,
  FilterOptions,
  Permission,
  StaffMinimalEmployee,
} from 'types';
import { getCookie } from 'cookies-next';
import { can, getAllSubCategories, toastGeneralError } from 'helpers';
import { GlobalApiInfo } from 'context';
import { getCareerHistoryTypes, getMinimalUsers } from 'services';

export const useDraftCareerLogs = (queryFilter: FilterOptions[], permissions: Permission[]) => {
  const [notResponseError, setNotResponseError] = useState(false);
  const [filterEmployees, setFilterEmployees] = useState<StaffMinimalEmployee[]>();
  const [filterCareerHistoryTypes, setFilterCareerHistoryTypes] = useState<ActionTypes[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(queryFilter);

  const { departments, positions, rawSeniorities } = useContext(GlobalApiInfo);

  const getInitialData = useCallback(async () => {
    try {
      const [minimalUsers, careerHistoryTypes] = await Promise.all([
        getMinimalUsers(getCookie('token')),
        getCareerHistoryTypes(getCookie('token')),
      ]);

      setFilterEmployees(minimalUsers.data);
      setFilterCareerHistoryTypes(
        can('employee::salary-view', permissions)
          ? careerHistoryTypes
          : careerHistoryTypes.filter((type) => type !== 'Salary'),
      );
    } catch (error: any) {
      toastGeneralError(error);
    }
  }, [permissions]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const getAllSubCategoriesForFilter = () => {
    return getAllSubCategories(
      {
        array: departments,
        type: 'department',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array: positions,
        type: 'job_title',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array: [
          {
            id: 'employee',
            title: 'Employee',
          },
          {
            id: 'freelancer',
            title: 'Freelancer',
          },
        ],
        type: 'employment_type',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array:
          filterEmployees?.map((el) => ({
            id: el.id,
            first_name: el.name,
            last_name: '',
          })) ?? [],
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'employee',
      },
      {
        array: rawSeniorities,
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'seniority',
      },
      {
        array: filterCareerHistoryTypes.map((el) => ({
          id: el,
          title: el,
        })),
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'log_type',
      },
      {
        array: [
          {
            id: 'full-time',
            title: 'Full-time',
          },
          {
            id: 'part-time',
            title: 'Part-time',
          },
          {
            id: 'on-demand',
            title: 'On-demand',
          },
        ],
        type: 'availability',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
    );
  };

  const handleFilterChange: EmployeeFilterAndSortReducerDispatch = (value) => {
    const newFilter = value.type === 'CLEAR_ALL_FILTER' ? [] : value.payload?.filterOptions!;
    setFilterOptions(newFilter);
  };

  return {
    notResponseError,
    setNotResponseError,
    filterOptions,
    setFilterOptions,
    handleFilterChange,
    getAllSubCategoriesForFilter,
  };
};
