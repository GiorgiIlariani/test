'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import {
  addClickAwayHandler,
  analytics,
  determineBudgetDates,
  formattedPhaseData,
  getQuery,
  onDiscountChange,
  toastGeneralError,
} from 'helpers';
import { useRemoveAnimatedNodes } from 'hooks';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext, UseFormSetValue, useWatch } from 'react-hook-form';
import {
  activateTerm,
  createPhase,
  deleteBudget,
  editBudgetTerms,
  movePhases,
  temporaryEditBudgetPhases,
} from 'services/budget';
import { Billing, PhasesForm, SetState, Staff } from 'types';
import { Props } from './types';

export const useBudgetingPhaseListingItem = (
  isOpen: boolean,
  i: number,
  setBudgetIsUpdated: SetState<boolean>,
  inputName: `phase.${number}`,
  publishedBudgetIsInEditMode: boolean,
  arePublicHolidaysCounted?: boolean,
  setIsSaving?: SetState<boolean>,
  setBudgetPhaseListingItemEdited?: Dispatch<SetStateAction<boolean>>,
  calculateProgress?: (
    i: number,
    type: Billing,
  ) => {
    filledPercentage: number;
    fieldQuantity: number;
    allFieldsCount: number;
    isEngagementFilled?: boolean;
    isRateFilled?: boolean;
    isRoleFilled?: boolean;
    isStaffFilled?: boolean;
    isDateFilled?: boolean;
    isDurationFilled?: boolean;
    progressList?: { title: string; filled: boolean }[];
  },
  updateBudgetAfterRateCardRemoved?: () => void,
  updateBudgetDates?: (start_date: number | null, end_date: number | null) => void,
  appendPhase?: Props['append'],
  rateCardId?: Props['rateCardId'],
  projectId?: Props['projectId'],
  isProjectPage?: Props['isProjectPage'],
  phases?: Props['phases'],
  budget?: Props['budget'],
  budgets?: Props['budgets'],
  setTermsAndBudgetsIsLoading?: Props['setTermsAndBudgetsIsLoading'],
  setOpenDeleteBudgetModal?: Props['setOpenDeleteBudgetModal'],
  getTermsAndBudgets?: () => Promise<void>,
  setProjectIsUpdated?: Props['setProjectIsUpdated'],
) => {
  const router = useRouter();

  const { getValues, control, setValue, register } = useFormContext<{
    phase: PhasesForm[];
  }>();

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isActionsClicked, setIsActionsClicked] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [termsToMove, setTermsToMove] = useState<number[]>([]);
  const [scopeToMoveTo, setScopeToMoveTo] = useState<string>();

  const { publicHolidays } = useContext(GlobalApiInfo);

  const ref = useRef<HTMLDivElement>(null);

  const { fields, append, remove } = useFieldArray<{ phase: any[] }>({
    name: `${inputName}.employees`,
    control,
  });

  const phaseType = useWatch({ name: `${inputName}.type`, control });
  const editPhaseId = Number(router.query.termId) ?? false;
  const addNewRole = () => {
    append({
      id: null,
      item_id: null,
      discount_duration: null,
      global_role_id: null,
      role: null,
      start_day: 1,
      start_date: getValues(inputName).start_date ?? null,
      start_date_updated: false,
      end_date: getValues(inputName).end_date ?? null,
      end_date_updated: false,
      duration: getValues(inputName).work_days_count ?? null,
      engagement: '',
      rate: '',
      is_free_of_charge: false,
      employee_id: null,
      sort_index: fields.length,
    });
  };

  const { removeNodes } = useRemoveAnimatedNodes({ condition: isOpen, duration: 150 });

  const editPhasesHandler = async (endDateUpdated?: boolean, startDateUpdated?: boolean) => {
    try {
      if (setBudgetPhaseListingItemEdited) {
        setBudgetPhaseListingItemEdited(true);
      }

      const formattedTerms = !!!editPhaseId
        ? getValues('phase')
        : getValues('phase')
            .concat(phases?.filter((el) => el.item_id !== editPhaseId)!)
            ?.filter((el) => el.item_id);

      let data = {
        terms: formattedPhaseData(formattedTerms, endDateUpdated, startDateUpdated),
        update_term_status: false,
        rate_card_id: rateCardId!,
        internal_project_id:
          typeof (projectId as { id: number })?.id === 'number'
            ? (projectId as { id: number })?.id
            : null,
        are_public_holidays_counted: arePublicHolidaysCounted ?? false,
      };

      let response;
      if (publishedBudgetIsInEditMode) {
        response = await temporaryEditBudgetPhases(
          getCookie('token'),
          router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
          data,
        );

        (response.terms as PhasesForm[]).forEach((term, termIndex) => {
          if (editPhaseId) {
            if (editPhaseId == term.id) {
              setValue(`phase.${0}.id`, term.id);
              setValue(`phase.${0}.item_id`, getValues('phase')[0]?.item_id ? term.id : null);
            }
          } else {
            setValue(`phase.${termIndex}.id`, term.id);
            setValue(
              `phase.${termIndex}.item_id`,
              getValues('phase')[termIndex]?.item_id ? term.id : null,
            );
          }
        });
      } else {
        response = await editBudgetTerms(
          getCookie('token'),
          router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
          data,
        );
        (response.terms as PhasesForm[]).forEach((term, termIndex) => {
          setValue(`phase.${termIndex}.id`, term.id);
          setValue(`phase.${termIndex}.item_id`, term.id);
        });
      }

      return response;
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const updateOnBlurHandler = async (
    callback?: (setValue: UseFormSetValue<any>, terms: PhasesForm[]) => void,
    notCalculateDate?: boolean,
    endDateUpdated?: boolean,
    startDateUpdated?: boolean,
  ) => {
    setIsSaving?.(true);
    try {
      const response = await editPhasesHandler(endDateUpdated, startDateUpdated);

      if (!notCalculateDate) {
        const { startDate, endDate } = determineBudgetDates(response.terms);
        updateBudgetDates?.(startDate, endDate);
      }

      if (response.rate_card_removed) {
        updateBudgetAfterRateCardRemoved?.();
      }

      setBudgetIsUpdated((prev) => !prev);
      callback?.(setValue, response.terms);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsSaving?.(false);
    }
  };

  const progress = calculateProgress?.(i, phaseType);

  const removeRoleHandler = (index: number, phaseIndex: number) => {
    remove(index);
    updateOnBlurHandler((setValue: UseFormSetValue<any>, terms: PhasesForm[]) => {
      onDiscountChange(setValue, phaseIndex, terms);
    });
  };

  const onDragEnd = (result: DropResult) => {
    const existingList = [
      ...getValues(`${inputName}.employees`).map((item, i) => ({
        ...item,
        id: fields[i].id,
      })),
    ] as Staff[];
    const { destination, source, draggableId } = result;

    const draggedItem = existingList.find((item) => item.id?.toString() === draggableId);
    existingList.splice(source.index, 1);
    existingList.splice(destination?.index as number, 0, draggedItem!);

    setValue(
      `${inputName}.employees`,
      existingList.map((item, i) => ({
        ...item,
        sort_index: i,
      })),
    );

    updateOnBlurHandler(() => {}, true);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const durationBtnRef = useRef<HTMLButtonElement>(null);
  const durationDropDownRef = useRef<HTMLDivElement>(null);

  const togglePhase = () => {
    isProjectPage
      ? analytics.track('More actions Clicked - Project page')
      : analytics.track('More actions Clicked - Budget page');
    addClickAwayHandler(buttonRef, dropDownRef, setIsActionsClicked);
    setIsActionsClicked(true);
  };

  const toggleDuration = (cb: () => void) => {
    addClickAwayHandler(durationBtnRef, durationDropDownRef, setIsDurationOpen, cb);
    setIsDurationOpen(true);
  };

  const isPhaseActionsDisabled =
    getValues(`phase`)?.length === 1 &&
    !getValues(`${inputName}.employees`)?.length &&
    !getValues(`${inputName}.name`) &&
    !getValues(`${inputName}.start_date`);

  const duplicatePhaseHandler = async (phaseIndex: number) => {
    if (setBudgetPhaseListingItemEdited) {
      setBudgetPhaseListingItemEdited(true);
    }
    try {
      let response;
      const originalPhaseName = getValues(`phase.${phaseIndex}`).name;
      let phaseName = '';

      let i = 0;

      while (true) {
        i++;
        const nameExists = getValues('phase').find(
          (el) => el.name === `${originalPhaseName} copy ${i}`,
        );
        if (!!nameExists) {
          continue;
        } else {
          phaseName = `${originalPhaseName} copy ${i}`;
        }
        break;
      }

      if (publishedBudgetIsInEditMode) {
        appendPhase?.({
          ...getValues(`phase.${phaseIndex}`),
          name: phaseName,
          id: null,
          item_id: null,
          start_date: '',
          end_date: '',
        });
        response = await editPhasesHandler();
      } else {
        response = await createPhase(
          getCookie('token'),
          router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
        );
        appendPhase?.({
          ...getValues(`phase.${phaseIndex}`),
          id: response.term_id,
          item_id: response.term_id,
          name: phaseName,
          start_date: '',
          end_date: '',
        });
        await editPhasesHandler();
      }
      setBudgetIsUpdated((prev) => !prev);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const months = getValues(`${inputName}.months`);
  const days = getValues(`${inputName}.days`);
  const monthsAndDaysExists = (months && +months > 0) || (days && +days > 0);

  const activateTermHandler = async () => {
    try {
      setValue(`${inputName}.status`, 'actual');
      await activateTerm(getCookie('token'), getValues(`${inputName}.id`)!);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const bulkMovePhasesHandler = async (
    targetBudgetId: string,
    phaseIds: number[],
    deleteScope: boolean = false,
  ) => {
    if (!budgets || phaseIds.length === 0) return;

    setTermsToMove(phaseIds);

    const remainingCurrentBudgetPhases = budget?.phase.filter(
      (phase) => !phaseIds.includes(phase.id!),
    );

    if (remainingCurrentBudgetPhases?.length === 0 && !deleteScope) {
      setOpenDeleteBudgetModal?.(true);
      setScopeToMoveTo(targetBudgetId);
      return;
    }

    setTermsAndBudgetsIsLoading?.(true);

    const movingPhases = budget?.phase.filter((phase) => phaseIds.includes(phase.id!));

    const updatedBudgets = budgets
      .map((mapBudget) => {
        if (!movingPhases) {
          return mapBudget;
        }

        const remainingPhases = mapBudget.phase.filter((phase) => !phaseIds.includes(phase.id!));

        if (Number(mapBudget.id) === Number(targetBudgetId)) {
          return {
            ...mapBudget,
            phase: [...mapBudget.phase, ...movingPhases],
          };
        }

        if (remainingPhases.length === 0) {
          return null;
        }

        return {
          ...mapBudget,
          phase: remainingPhases,
        };
      })
      .filter(Boolean);

    // @ts-ignore
    setValue('budgets', updatedBudgets);

    try {
      await movePhases(getCookie('token'), Number(targetBudgetId), phaseIds);

      if (deleteScope && budget?.id) {
        await deleteBudget(getCookie('token'), budget.id);
      }
      getTermsAndBudgets?.();
      setProjectIsUpdated?.((prev) => !prev);
    } catch (e) {
      toastGeneralError(e);
    }
  };

  return {
    removeNodes,
    getValues,
    fields,
    addNewRole,
    isProgressModalOpen,
    setIsProgressModalOpen,
    updateOnBlurHandler,
    setValue,
    isOpen,
    holidays: publicHolidays.holidays,
    progress,
    removeRoleHandler,
    onDragEnd,
    togglePhase,
    buttonRef,
    dropDownRef,
    isActionsClicked,
    deleteDialog,
    setDeleteDialog,
    ref,
    isPhaseActionsDisabled,
    duplicatePhaseHandler,
    phaseType,
    toggleDuration,
    durationBtnRef,
    durationDropDownRef,
    isDurationOpen,
    register,
    months,
    days,
    monthsAndDaysExists,
    activateTermHandler,
    isActivateOpen,
    setIsActivateOpen,
    editPhaseId,
    termsToMove,
    setTermsToMove,
    scopeToMoveTo,
    setScopeToMoveTo,
    bulkMovePhasesHandler,
  };
};
