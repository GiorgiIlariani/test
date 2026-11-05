'use client';

import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Budgeting, BudgetNavTypes } from 'types/Budget';
import { filterDuplicatesByTitle, getAllSubCategories, toastGeneralError } from 'helpers';
import { archiveBudget, deleteBudget, getAllBudgets, unarchiveBudget } from 'services/budget';
import { getCookie } from 'cookies-next';
import { budgetDashboardReducer } from 'store';
import {
  AllSubCategories,
  BudgetDashboardFilterReducerDispatch,
  Currency,
  ProjectDashboard,
} from 'types';
import { GlobalApiInfo } from 'context';
import { getAllProjects, getApplicationConfigs } from 'services';
import { useRouter } from 'next/router';
import { useCreateBudget } from '../BudgetsPageHeader/useCreateBudget';

export const useBudgetCards = () => {
  const router = useRouter();
  const routerRef = useRef(router);
  const { projectManagers } = useContext(GlobalApiInfo);

  const [isInitialBudgetDataLoading, setIsInitialBudgetDataLoading] = useState(true);
  const [isBudgetLoading, setIsBudgetLoading] = useState(false);
  const [navState, setNavState] = useState<BudgetNavTypes>('Unpublished');
  const [budgets, setBudgets] = useState<Budgeting[]>([]);
  const [projects, setProjects] = useState<ProjectDashboard[]>([]);
  const [recents, setRecents] = useState<Budgeting[]>([]);
  const [budgetSort, setBudgetSort] = useState<string | undefined>();
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>('GEL');
  const { createBudgetHandler, isBudgetCreationLoading } = useCreateBudget(defaultCurrency);

  const [budgetDataReducer, dispatchBudgetData] = useReducer(budgetDashboardReducer, {
    initialBudgets: budgets,
    budgets,
    filterOptions: [],
  });

  const [subCategories, setAllSubCategories] = useState<AllSubCategories[]>(
    getAllSubCategoriesForFilter(),
  );

  useEffect(() => {
    (dispatchBudgetData as BudgetDashboardFilterReducerDispatch)({
      type: 'RESET_PROJECTS',
      payload: {
        initialBudgets: budgets,
        budgets,
        filterOptions: budgetDataReducer.filterOptions,
      },
    });
  }, [budgetDataReducer.filterOptions, budgets]);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const [budgets, projects, config] = await Promise.all([
          getAllBudgets(getCookie('token'), 'unpublished'),
          getAllProjects(getCookie('token')),
          getApplicationConfigs(getCookie('token')),
        ]);

        setDefaultCurrency(config?.currency?.currency ?? 'GEL');
        setProjects(projects);
        setRecents(budgets.recent_budgets);
        setBudgets(budgets.all_budgets);
      } catch (error) {
        toastGeneralError(error, routerRef.current);
      } finally {
        setIsInitialBudgetDataLoading(false);
      }
    };

    getInitialData();
  }, []);

  const navChangeHandler = async (state: BudgetNavTypes) => {
    try {
      setNavState(state);
      setIsBudgetLoading(true);
      const budgets = await getAllBudgets(getCookie('token'), state.toLowerCase(), 0);
      setBudgets(budgets.all_budgets);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsBudgetLoading(false);
    }
  };

  const deleteHandler = async (id: number) => {
    const previousBudgets = budgets;
    const previousRecents = recents;

    try {
      setBudgets((prevBudgets) => {
        return [...prevBudgets].filter((budget) => budget.id !== id);
      });
      setRecents((prevRecents) => {
        return [...prevRecents].filter((budget) => budget.id !== id);
      });
      await deleteBudget(getCookie('token'), id);
    } catch (error) {
      setBudgets(previousBudgets);
      setRecents(previousRecents);
      toastGeneralError(error, router);
    }
  };

  const archiveHandler = async (id: number) => {
    const previousBudgets = budgets;
    const previousRecents = recents;

    try {
      setBudgets((prevBudgets) => {
        return [...prevBudgets].map((budget) =>
          budget.id === id ? { ...budget, status: 'archived' } : budget,
        );
      });
      setRecents((prevRecents) => {
        return [...prevRecents].map((budget) =>
          budget.id === id ? { ...budget, status: 'archived' } : budget,
        );
      });
      await archiveBudget(getCookie('token'), id);
    } catch (error) {
      setBudgets(previousBudgets);
      setRecents(previousRecents);
      toastGeneralError(error, router);
    }
  };

  const unarchiveHandler = async (id: number) => {
    const previousBudgets = budgets;
    const previousRecents = recents;

    try {
      setBudgets((prevBudgets) => {
        return [...prevBudgets].map((budget) =>
          budget.id === id ? { ...budget, status: 'unpublished' } : budget,
        );
      });
      setRecents((prevRecents) => {
        return [...prevRecents].map((budget) =>
          budget.id === id ? { ...budget, status: 'unpublished' } : budget,
        );
      });
      await unarchiveBudget(getCookie('token'), id);
    } catch (error) {
      setBudgets(previousBudgets);
      setRecents(previousRecents);
      toastGeneralError(error, router);
    }
  };

  const filteredBudgetData = budgetDataReducer.budgets.filter((data) =>
    navState === 'All' ? true : data.status === navState.toLowerCase(),
  );

  switch (budgetSort) {
    case 'alphabetical':
      filteredBudgetData.sort((a, b) =>
        (a.title ?? 'Untitled').localeCompare(b.title ?? 'Untitled'),
      );
      break;
    case 'dateDescending':
      filteredBudgetData.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      break;
    case 'dateAscending':
      filteredBudgetData.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      break;
  }

  function getAllSubCategoriesForFilter() {
    return getAllSubCategories(
      {
        array: projectManagers,
        type: 'budget_project_owners',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array: projects?.map((project) => ({
          id: project.id,
          title: project.title,
          status: project.status,
        })),

        shouldDefaultToAndInInsideCondition: false,
        type: 'project_budget',
        filter_type: 'select',
      },
      {
        array: filterDuplicatesByTitle(
          budgets?.map((budget) => ({
            id: budget.title?.toLocaleLowerCase(),
            title: budget.title,
          })),
        ),
        shouldDefaultToAndInInsideCondition: true,
        type: 'budget',
        filter_type: 'select',
      },
    );
  }

  return {
    filteredBudgetData,
    isInitialBudgetDataLoading,
    createBudgetHandler,
    isBudgetCreationLoading,
    navState,
    recents,
    budgetSort,
    setBudgetSort,
    getAllSubCategoriesForFilter,
    dispatchBudgetData,
    subCategories,
    setAllSubCategories,
    budgetDataReducer,
    deleteHandler,
    archiveHandler,
    isBudgetLoading,
    navChangeHandler,
    unarchiveHandler,
  };
};
