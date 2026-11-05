'use client';

import { GlobalApiInfo } from 'context';
import {
  convertUrlFilterToUsableWithDateFilter,
  formatDate,
  getAllSubCategories,
  objectKeys,
  toastGeneralError,
} from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useReducer, useState } from 'react';
import { projectDashboardReducer } from 'store';
import {
  AllSubCategories,
  Currency,
  FilterState,
  ProjectDashboard,
  ProjectDashboardFilterReducerDispatch,
  StaffMinimalEmployee,
} from 'types';
import { getApplicationConfigs, getProjectsIndex } from 'services';
import { getCookie } from 'cookies-next';
import { PROJECT_TYPE_OPTIONS } from 'config';

export const useProjects = (minimalUsers: StaffMinimalEmployee[], serverSideFilters: string) => {
  const { projectManagers } = useContext(GlobalApiInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectDashboard[]>([]);
  const [projectDataReducer, dispatchProjectData] = useReducer(projectDashboardReducer, {
    initialProjectData: projects,
    projects,
    filterOptions: convertUrlFilterToUsableWithDateFilter(serverSideFilters),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>('GEL');
  const router = useRouter();

  const filters = (typeof router.query.filterBy === 'string' ? router.query.filterBy : '').split(
    ',',
  );

  const initialFilters: FilterState = {
    'pre-sale': filters.includes('pre-sale'),
    active: filters.includes('active'),
    completed: filters.includes('completed'),
  };

  const isAnyFilterActive = Object.values(initialFilters).some(Boolean);

  const [filterState, setFilterState] = useState<FilterState>(
    isAnyFilterActive ? initialFilters : { 'pre-sale': false, active: true, completed: false },
  );

  const updateProjectFilterState = (newState: FilterState) => {
    setFilterState(newState);
    getProjectDashboard(newState);
  };

  const [subCategories, setAllSubCategories] = useState<AllSubCategories[]>(
    getAllSubCategoriesForFilter(),
  );
  const [currency, setCurrency] = useState<Currency>('GEL');

  const getProjectDashboard = async (argumentState = filterState) => {
    setIsLoading(true);
    try {
      const statuses = Object.keys(argumentState).filter((key) => argumentState[key]);
      const [dashboard, config] = await Promise.all([
        getProjectsIndex(getCookie('token'), statuses),
        getApplicationConfigs(getCookie('token')),
      ]);
      setDefaultCurrency(config?.currency?.currency ?? 'GEL');
      setProjects(dashboard);
      setIsLoading(false);
    } catch (error) {
      toastGeneralError(error, router);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProjectDashboard();
  }, []);

  useEffect(() => {
    (dispatchProjectData as ProjectDashboardFilterReducerDispatch)({
      type: 'RESET_PROJECTS',
      payload: {
        initialProjectData: projects,
        projects,
        filterOptions: projectDataReducer.filterOptions,
      },
    });
  }, [projects, projects?.length, serverSideFilters]);

  function filterProjects(project: Partial<(typeof projects)[number]>) {
    const checkedKeys = Object.keys(filterState).filter((key) => filterState[key]);
    return checkedKeys.includes(project.status?.toLowerCase() ?? '');
  }

  const getDiscountDurationDueDate = (discountDuration: number) => {
    const today = new Date();
    today.setMonth(today.getMonth() + discountDuration);
    return formatDate(today);
  };

  function getAllSubCategoriesForFilter() {
    return getAllSubCategories(
      {
        array: projectManagers,
        type: 'project_owners',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array: PROJECT_TYPE_OPTIONS.map((value) => ({
          id: value.value,
          name: value.text.split(' ')?.[0],
        })),
        shouldDefaultToAndInInsideCondition: true,
        type: 'project_type',
        filter_type: 'select',
      },
      {
        array: projects?.map((project) => ({
          id: project.id,
          title: project.title,
          status: project.status,
        })),

        shouldDefaultToAndInInsideCondition: false,
        type: 'project',
        filter_type: 'select',
      },
      {
        array: minimalUsers?.map((minimalUser) => ({
          id: minimalUser.id,
          name: minimalUser.name,
        })),
        shouldDefaultToAndInInsideCondition: true,
        type: 'project_members',
        filter_type: 'select',
      },
      {
        array: [
          { id: 'draft', name: 'Draft' },
          { id: 'actual', name: 'Actual' },
          { id: 'booked', name: 'Booked' },
          { id: 'expired', name: 'Expired' },
        ],
        shouldDefaultToAndInInsideCondition: true,
        type: 'term_status',
        filter_type: 'select',
      },
    );
  }

  const selectedFilteredStateString = objectKeys(filterState)
    ?.filter((el) => filterState[el])
    ?.join(' and ')
    ?.toLocaleLowerCase();

  return {
    isOpen,
    setIsOpen,
    filterState,
    setFilterState,
    router,
    filterProjects,
    getDiscountDurationDueDate,
    projectDataReducer,
    dispatchProjectData,
    getAllSubCategoriesForFilter,
    subCategories,
    setAllSubCategories,
    isLoading,
    getProjectDashboard,
    projectManagers,
    selectedFilteredStateString,
    currency,
    setCurrency,
    defaultCurrency,
    updateProjectFilterState,
  };
};
