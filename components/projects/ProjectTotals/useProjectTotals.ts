'use client';

import { getCookie } from 'cookies-next';
import { objectKeys, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getProjectTotals } from 'services';
import { AdvancedSelectList, BudgetTotals, BudgetTotalsTerm, MonthlyTerms } from 'types';

export const useProjectTotals = (
  selectedScopeId: number,
  selectedTermId: number,
  totalNav: string,
  projectIsUpdated: boolean,
) => {
  const keysToSum = ['subtotal', 'free_of_charge', 'discount', 'total', 'cost', 'profit'] as const;

  const budgetTotalsInitialValues = {
    subtotal: 0,
    free_of_charge: 0,
    discount: 0,
    total: 0,
    cost: 0,
    profit: 0,
    by_phase: [],
    by_month: { by_phase: [] },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [budgetTotals, setBudgetTotals] = useState<BudgetTotals>();
  const [budgetTotalsSum, setBudgetTotalsSum] = useState<BudgetTotals[]>();
  const [hasExpired, setHasExpired] = useState<boolean>(false);
  const form = useForm();

  const router = useRouter();
  const projectId = +router.query?.project?.[0]!;

  const isPossibleToCalculate = !!selectedTermId;

  const sumSpecificKeysToObject = (objectsArray: BudgetTotals[]) => {
    return objectsArray.reduce((result, obj) => {
      keysToSum.forEach((key) => {
        result[key] = (result[key] || 0) + (obj[key] || 0);
      });
      return result;
    }, budgetTotalsInitialValues);
  };

  const sumByMonth = (objectsArray: MonthlyTerms[]) => {
    const totalsByMonth = objectsArray.reduce((result: MonthlyTerms, obj) => {
      Object.keys(obj).forEach((dateKey) => {
        if (dateKey === 'by_phase') {
          return;
        }

        if (!result[dateKey]) {
          result[dateKey] = { ...obj[dateKey] };
        } else {
          keysToSum.forEach((key) => {
            result[dateKey][key] = (result[dateKey][key] || 0) + (obj[dateKey][key] || 0);
          });
        }
      });

      return result;
    }, {} as MonthlyTerms);

    Object.values(totalsByMonth).forEach((monthTotals) => {
      monthTotals.profit_margin = monthTotals.total
        ? Math.round((monthTotals.profit / monthTotals.total) * 100)
        : 0;
    });

    return totalsByMonth;
  };

  const getProjectTotalsHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getProjectTotals(getCookie('token'), projectId);
      setBudgetTotalsSum(response);
      setHasExpired(response.some((budget) => budget.has_expired === true));
      const sumOfResponse = sumSpecificKeysToObject(response) as any;
      setBudgetTotals({
        ...sumOfResponse,
        by_phase: response.flatMap((budget) => budget.by_phase),
        by_month: {
          ...sumByMonth(response.flatMap?.((el) => el.by_month)),
          by_phase: response.reduce(
            (a, b) => ({ ...a, ...b.by_month.by_phase }),
            {},
          ) as BudgetTotals['by_month']['by_phase'],
        },
      });
      form.setValue('selected_scope', 'all');
      form.setValue('selected_term', 'all');
      setIsLoading(false);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    getProjectTotalsHandler();
  }, [projectIsUpdated]);

  const selectedScopeExists = !!budgetTotalsSum?.find(
    (budget) => budget.budgetId === selectedScopeId,
  );

  const selectedTermExists = !!budgetTotals?.by_phase?.find(
    (term) => term.term_id === selectedTermId,
  );

  const findTotalsObject = () => {
    if (selectedTermExists) {
      return budgetTotals?.by_phase?.find((term) => term.term_id === selectedTermId);
    }

    if (selectedScopeExists) {
      return budgetTotalsSum?.find((budget) => budget.budgetId === selectedScopeId);
    }

    return budgetTotals;
  };

  const getFilteredKeys = () => {
    if (totalNav === 'month') {
      if (selectedTermExists) {
        const object = { ...budgetTotals?.by_month?.by_phase?.[selectedTermId!] };

        delete object['monthly_missing'];

        return objectKeys(object);
      }

      if (selectedScopeExists && !selectedTermExists) {
        const scope = budgetTotalsSum?.find((b) => b.budgetId === selectedScopeId);
        return objectKeys(scope?.by_month ?? {});
      }

      return objectKeys(budgetTotals?.by_month ?? {});
    }

    if (selectedScopeExists && !selectedTermExists) {
      const scope = budgetTotalsSum?.find((b) => b.budgetId === selectedScopeId);
      return scope?.by_phase ?? [];
    }

    return budgetTotals?.by_phase ?? [];
  };

  const filteredItems = (getFilteredKeys() as BudgetTotalsTerm[])?.filter(
    (item: string | number | BudgetTotalsTerm) => {
      return typeof item === 'string' || typeof item === 'number' ? item !== 'by_phase' : true;
    },
  );

  const findCalculationItem = (item: string | number | BudgetTotalsTerm) => {
    if (!(typeof item === 'string' || typeof item === 'number')) {
      return item;
    }
    if (selectedTermExists) {
      return budgetTotals?.by_month?.by_phase?.[selectedTermId!]?.[item]!;
    }

    if (selectedScopeExists && !selectedTermExists) {
      const scope = budgetTotalsSum?.find((b) => b.budgetId === selectedScopeId);
      return scope?.by_month?.[item]!;
    }

    return budgetTotals?.by_month?.[item]!;
  };

  const findCalculationTitle = (item: string | number | BudgetTotalsTerm) => {
    if (!(typeof item === 'string' || typeof item === 'number')) {
      return item.term_name;
    }

    const invalidMonthRegex = /Month\s\d+/;

    if (invalidMonthRegex.test(String(item))) {
      return item;
    }

    const date = new Date(`${item}-01`);

    const monthName = date.toLocaleString('default', { month: 'short' });
    const yearLastTwoDigit = date.toLocaleDateString('default', { year: '2-digit' });

    const formattedDate = monthName + ' ' + yearLastTwoDigit;

    return formattedDate;
  };

  const getCurrentScopes = () => {
    const scopes: AdvancedSelectList[] = [{ title: 'All scopes', id: 'all' }];

    budgetTotalsSum?.forEach((budget) => {
      scopes.push({ title: budget.budget_name ?? 'Untitled', id: budget.budgetId });
    });

    return scopes;
  };

  const getCurrentTerms = () => {
    let terms: AdvancedSelectList[] = [{ title: 'All phases', id: 'all' }];

    const found = budgetTotalsSum?.find((b) => b.budgetId === selectedScopeId);
    const budgetsToUse = selectedScopeId && found ? [found] : budgetTotalsSum;

    budgetsToUse
      ?.flatMap((budget) => budget.by_phase)
      .forEach((term) => {
        terms.push({
          title: term.term_name ?? 'Untitled',
          id: term.term_id!,
          type: term.type,
        });
      });

    return terms;
  };

  const selectedTermTypeIsMonthly =
    getCurrentTerms()?.find((el) => el.id === selectedTermId)?.type === 'monthly';

  return {
    setIsLoading,
    isLoading,
    form,
    isPossibleToCalculate,
    selectedScopeExists,
    selectedTermExists,
    findTotalsObject,
    filteredItems,
    findCalculationItem,
    findCalculationTitle,
    getCurrentScopes,
    getCurrentTerms,
    budgetTotalsSum,
    budgetTotals,
    selectedTermTypeIsMonthly,
    hasExpired,
  };
};
