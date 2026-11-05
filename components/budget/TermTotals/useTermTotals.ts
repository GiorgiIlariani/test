'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { AdvancedSelectList, BudgetTotals, BudgetTotalsTerm } from 'types';
import {
  getBudgetTotals,
  temporaryUpdateRatesBasedOnMonthly,
  temporaryUpdateRatesBasedOnSubtotal,
  updateRatesBasedOnMonthly,
  updateRatesBasedOnSubtotal,
} from 'services/budget';
import { getCookie } from 'cookies-next';
import { objectKeys, toastGeneralError } from 'helpers';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Props } from './types';

export const useTermTotals = (
  budgetIsUpdated: boolean,
  selectedTermId: number | string | null,
  budgetId: number,
  totalNav: string,
  getBudgetingPhasesHandler: () => Promise<void>,
  rateCardUpdated: boolean,
  countHolidaysUpdated: boolean,
  projectTypeUpdated: boolean,
  publishedBudgetIsInEditMode: boolean,
  setSelectedTermId?: Props['setSelectedTermId'],
  setBudgetTotal?: Props['setBudgetTotal'],
  budgetPhaseListingItemEdited?: boolean,
  shouldResetTotals?: boolean,
  setShouldResetTotals?: Dispatch<SetStateAction<boolean>>,
) => {
  const [canNotCalculate, setCanNotCalculate] = useState(false);
  const [budgetTotals, setBudgetTotals] = useState<BudgetTotals>();
  const [subtotalModalIsOpen, setSubtotalModalIsOpen] = useState(false);
  const [subtotalModalIsOpenByMonthly, setSubtotalModalIsOpenByMonthly] = useState(false);
  const { register, setValue, getValues, setFocus, formState } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const [oldSubtotal, setOldSubtotal] = useState<number>();
  const [oldMonthly, setOldMonthly] = useState<number>();
  const [fee, setFee] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  const router = useRouter();
  const editPhaseId = Number(router.query.termId);

  const totalTermRef = useRef<HTMLInputElement | null>(null);
  const totalTermRefSecond = useRef<HTMLInputElement | null>(null);
  const monthlyRef = useRef<HTMLInputElement | null>(null);
  const [initialResponse, setInitialResponse] = useState<BudgetTotals>();

  const getBudget = async (draftRequest: boolean = false, resetingTotals: boolean = false) => {
    try {
      let response;
      if (resetingTotals) {
        response = initialResponse;
        setShouldResetTotals?.(false);
      } else {
        setIsLoading(true);

        response = await getBudgetTotals(
          getCookie('token'),
          budgetId,
          draftRequest || (publishedBudgetIsInEditMode && !isInitialRender),
        );
      }

      if (isInitialRender) {
        setInitialResponse(response);
        setIsInitialRender(false);
      }

      setCanNotCalculate(response!.can_not_calculate);
      setValue('subtotal', Math.round(response!.subtotal));

      setBudgetTotal?.({
        subtotal: Math.round(response!.subtotal),
        profit_margin: Math.round(response!.profit_margin),
      });
      const phaseSubtotal = { ...getValues('phase_subtotal') };
      const phaseMonthly = { ...getValues('phase_monthly') };

      response!.by_phase.forEach((phase) => {
        phaseSubtotal[`${phase.term_id}`] = Math.round(phase.subtotal);
        if (phase.type === 'monthly') {
          phaseMonthly[`${phase.term_id}`] = Math.round(phase.fee ?? 0);
        }
      });

      setValue('phase_subtotal', phaseSubtotal);
      setValue('phase_monthly', phaseMonthly);
      setBudgetTotals(response);

      if (!!editPhaseId) {
        setSelectedTermId?.(editPhaseId);
      }
      setValue('selected_term', 'all');

      setIsLoading(false);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    getBudget();
  }, [budgetIsUpdated, rateCardUpdated, countHolidaysUpdated, projectTypeUpdated]);

  useEffect(() => {
    if (shouldResetTotals) {
      getBudget(false, shouldResetTotals);
    }
  }, [shouldResetTotals]);

  const selectedTermExists = !!budgetTotals?.by_phase.find(
    (term) => term.term_id === selectedTermId,
  );

  const findCalculationItem = (item: string | number | BudgetTotalsTerm) => {
    if (!(typeof item === 'string' || typeof item === 'number')) {
      return item;
    }
    if (selectedTermExists) {
      return budgetTotals?.by_month?.by_phase?.[selectedTermId!]?.[item]!;
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

  const findTotalsObject = () => {
    if (!selectedTermExists) {
      return budgetTotals;
    }

    return budgetTotals?.by_phase?.find((term) => term.term_id === selectedTermId);
  };

  const getFilteredKeys = () => {
    if (totalNav === 'month') {
      if (selectedTermExists) {
        const object = { ...budgetTotals?.by_month?.by_phase?.[selectedTermId!] };

        delete object['monthly_missing'];

        return objectKeys(object);
      }
      return objectKeys(budgetTotals?.by_month ?? {});
    }

    return budgetTotals?.by_phase ?? [];
  };

  // @ts-ignore
  const filteredItems = getFilteredKeys().filter((item: string | number | BudgetTotalsTerm) => {
    return typeof item === 'string' || typeof item === 'number' ? item !== 'by_phase' : true;
  });

  const updateRates = async (
    e: string,
    selectedTermId: string | number | null,
    isMonthly: boolean,
  ) => {
    let draftRequest = false;
    if (isMonthly) {
      if (publishedBudgetIsInEditMode) {
        await temporaryUpdateRatesBasedOnMonthly(getCookie('token'), budgetId, fee, selectedTermId);
        draftRequest = true;
      } else {
        await updateRatesBasedOnMonthly(getCookie('token'), budgetId, fee, selectedTermId);
      }
      setFee(0);
    } else {
      if (publishedBudgetIsInEditMode) {
        await temporaryUpdateRatesBasedOnSubtotal(
          getCookie('token'),
          budgetId,
          Number(e),
          selectedTermId,
        );
        draftRequest = true;
      } else {
        await updateRatesBasedOnSubtotal(getCookie('token'), budgetId, Number(e), selectedTermId);
      }
    }

    await Promise.all([getBudgetingPhasesHandler(), getBudget(draftRequest)]);
  };

  const getCurrentTerms = () => {
    let terms: AdvancedSelectList[] = [{ title: 'All phases', id: 'all' }];
    budgetTotals?.by_phase.forEach((term) => {
      terms.push({ title: term.term_name ?? 'Untitled', id: term.term_id!, type: term.type });
    });
    return terms;
  };

  const calculateMissingText = (text: string) => {
    switch (text) {
      case 'both missing separately':
        return 'Costs and/or revenue for employee(s) without engagement or hourly rate are not calculated in totals.';

      case 'engagement missing':
        return 'Costs and revenue for employee(s) without engagement are not calculated in totals.';

      case 'rate missing':
        return 'Revenue for employee(s) without hourly rate is not calculated in totals.';

      default:
        return 'Costs and revenue for employee(s) without engagement and hourly rate are not calculated in totals.';
    }
  };

  const calculateMonthlyMissingText = (text: string) => {
    switch (text) {
      case 'both missing':
        return 'Costs and profit use average role costs. Add a start date and staffing for exact amounts.';

      case 'start date missing':
        return 'Costs and profit use average hourly rates per month. Add a start date for exact amounts.';

      default:
        return 'Costs and profit use average role costs. Add staffing details for exact amounts.';
    }
  };

  const isPossibleToCalculate = canNotCalculate || (selectedTermId && !selectedTermExists);

  const closeHandler = () => {
    if (subtotalModalIsOpenByMonthly) {
      setSubtotalModalIsOpenByMonthly(false);
      setValue(`phase_monthly.${selectedTermId}`, oldMonthly);
      setFee(0);
    } else {
      setSubtotalModalIsOpen(false);

      selectedTermId
        ? setBudgetTotals((prev) => {
            if (!prev) return prev;

            setValue(`phase_subtotal.${selectedTermId}`, oldSubtotal);
            const newBudget = { ...prev };
            const updatedByPhase = newBudget.by_phase.map((phase) => {
              if (selectedTermId === phase.term_id) {
                setOldSubtotal(phase.subtotal);
                return {
                  ...phase,
                  subtotal: oldSubtotal!,
                };
              }

              return phase;
            });

            return {
              ...newBudget,
              by_phase: updatedByPhase,
            };
          })
        : setBudgetTotals((prev) => {
            if (!prev) return prev;

            setValue('subtotal', oldSubtotal);
            const newBudget = { ...prev };
            newBudget.subtotal = oldSubtotal!;
            return newBudget;
          });

      setOldSubtotal(undefined);
    }
  };

  const monthlyMissingText = selectedTermExists
    ? budgetTotals?.by_month?.by_phase?.[selectedTermId!]?.monthly_missing
    : budgetTotals?.monthly_missing;

  const selectedTermTypeIsMonthly =
    getCurrentTerms()?.find((el) => el.id === selectedTermId)?.type === 'monthly';

  return {
    updateRates,
    filteredItems,
    findTotalsObject,
    findCalculationTitle,
    findCalculationItem,
    subtotalModalIsOpen,
    setSubtotalModalIsOpen,
    register,
    setValue,
    getValues,
    canNotCalculate,
    budgetTotals,
    getCurrentTerms,
    isLoading,
    selectedTermExists,
    isPossibleToCalculate,
    calculateMissingText,
    setBudgetTotals,
    setOldSubtotal,
    closeHandler,
    setFocus,
    totalTermRef,
    totalTermRefSecond,
    calculateMonthlyMissingText,
    monthlyMissingText,
    selectedTermTypeIsMonthly,
    monthlyRef,
    subtotalModalIsOpenByMonthly,
    setSubtotalModalIsOpenByMonthly,
    fee,
    setFee,
    formState,
    setOldMonthly,
    editPhaseId,
  };
};
