'use client';

import { getCookie } from 'cookies-next';
import {
  analytics,
  determineBudgetDates,
  formatBudgetPhaseData,
  formattedPhaseData,
  getQuery,
  toastGeneralError,
} from 'helpers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { deleteBudgetTerm } from 'services';
import {
  archiveBudget,
  createPhase,
  deleteBudget,
  getBudgetingPhases,
  savePublishedBudget,
  temporaryEditBudgetPhases,
} from 'services/budget';
import { Billing, BudgetForm, PhasesForm, SetState, TermStatus } from 'types';
import { Props } from './types';
import { PROJECT_TYPE } from 'config';

export const useBudgetingPhaseListing = (
  setIsLoading: SetState<boolean>,
  rateCardUpdated: boolean,
  countHolidaysUpdated: boolean,
  projectTypeUpdated: boolean,
  updateBudgetDates: (start_date: number | null, end_date: number | null) => void,
  projectData: Props['projectData'],
  publishedBudgetIsInEditMode: Props['publishedBudgetIsInEditMode'],
  form: Props['phaseForm'],
  setPublishedBudgetIsInEditMode: Props['setPublishedBudgetIsInEditMode'],
  arePublicHolidaysCounted: boolean,
  shouldResetTerms?: boolean,
  setShouldResetTerms?: SetState<boolean>,
) => {
  const [phases, setPhases] = useState<PhasesForm[]>();
  const [budgetIsUpdated, setBudgetIsUpdated] = useState(false);
  const [totalNav, setTotalNav] = useState('total');
  const [subtotalEditIsActive, setSubtotalEditIsActive] = useState(false);
  const [monthlyEditIsActive, setMonthlyEditIsActive] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [publishedBudgetData, setPublishedBudgetData] = useState<{
    publishedPhases: number;
    draftPhases: number;
    isNewScope: boolean;
    newBudgetId: number;
    project_id: number;
    project_title: string;
    isDeleted: boolean;
    isDrafted: boolean;
  }>();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [projectId, setProjectId] = useState(projectData.id);
  const [budgetTotal, setBudgetTotal] = useState({ subtotal: 0, profit_margin: 0 });
  const [budgetPhaseListingItemEdited, setBudgetPhaseListingItemEdited] = useState<boolean>(false);

  const router = useRouter();

  const { fields, append, remove } = useFieldArray({ name: 'phase', control: form?.control });

  const [isOpen, setIsOpen] = useState<number | undefined>();
  const [selectedTermId, setSelectedTermId] = useState<string | number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  const editPhaseId = Number(router.query.termId) ?? false;
  const [backUpPhases, setBackUpPhases] = useState<PhasesForm[]>();
  const [deleteScopeModalIsOpen, setDeleteScopeModalIsOpen] = useState(false);

  const projectType = projectData.project?.type ?? projectData.project_type;

  const isProjectInternal = projectType === PROJECT_TYPE.INTERNAL;

  const editPhasesHandler = async (inSinglePhaseMode: boolean | number = false) => {
    try {
      let data = {
        terms: formattedPhaseData(form.getValues('phase')),
      };

      let response: { terms: PhasesForm[] };
      response = await temporaryEditBudgetPhases(
        getCookie('token'),
        router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
        {
          ...data,
          update_term_status: false,
          rate_card_id: projectData?.rate_card_id!,
          internal_project_id:
            (projectData.internal_project_id as { id: number })?.id ??
            projectData.internal_project_id,
          are_public_holidays_counted: arePublicHolidaysCounted,
        },
      );

      if (!inSinglePhaseMode) {
        (response.terms as PhasesForm[]).forEach((term, termIndex) => {
          if (termIndex === response?.terms.length - 1) {
            form.setValue(`phase.${termIndex}.id`, term.id);
          } else {
            form.setValue(`phase.${termIndex}.id`, term.id);
            form.setValue(`phase.${termIndex}.item_id`, term.id);
          }
        });
      } else {
        form.setValue(`phase`, []);
      }

      return response;
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const createNewPhase = async () => {
    try {
      const response = await createPhase(
        getCookie('token'),
        router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
      );

      form.setValue(`phase.${fields.length}.id`, response.term_id);
      form.setValue(`phase.${fields.length}.item_id`, response.term_id);
    } catch (_error) {}
  };

  const openDeleteScopeModal = () => {
    setDeleteScopeModalIsOpen(true);
  };

  const appendNewPhase = () => {
    append(
      {
        id: null,
        item_id: null,
        name: '',
        start_date: '',
        end_date: '',
        work_days_count: 0,
        discount_duration: 0,
        type: 'default',
        discount: '',
        role: null,
        employees: [],
        discount_toggle: false,
        duration: 0,
        ready_to_book: false,
        status: 'draft',
        months: '',
        days: '',
      },
      { shouldFocus: false },
    );
    analytics.track('Add new phase');

    publishedBudgetIsInEditMode ? editPhasesHandler() : createNewPhase();
  };

  const getBudgetingPhasesHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getBudgetingPhases(
        getCookie('token'),
        router.query.budget?.[0] ? +router.query.budget?.[0]! : +router.query.budgetId!,
        publishedBudgetIsInEditMode && !isInitialRender,
      );

      const formattedResponse = formatBudgetPhaseData(response);

      const currentPublishedPhase = !!editPhaseId
        ? [formattedResponse.find((phase) => phase.id === editPhaseId)]
        : [];

      if (formattedResponse.length) {
        setPhases(
          formattedResponse.map((el) => ({
            ...el,
            ready_to_book: true,
            status: setStatusToPhaseHandler(false, el.status),
          })),
        );
        setBackUpPhases(
          !!editPhaseId ? (currentPublishedPhase as PhasesForm[]) : formattedResponse,
        );
        form.reset({ phase: !!editPhaseId ? currentPublishedPhase : formattedResponse });
      }

      setBudgetIsUpdated(true);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsLoading(false);
      setIsInitialRender(false);
    }
  };

  const resetTermsToDefault = () => {
    form.reset({ phase: backUpPhases });
    setShouldResetTerms?.(false);
  };

  useEffect(() => {
    getBudgetingPhasesHandler();
  }, [rateCardUpdated, countHolidaysUpdated, projectTypeUpdated]);

  useEffect(() => {
    if (shouldResetTerms) {
      resetTermsToDefault();
    }
  }, [shouldResetTerms]);

  const calculateProgress = (i: number, type: Billing) => {
    const phase = form.getValues('phase')?.[i];
    if (!phase) return { allFieldsCount: 0, filledPercentage: 0, fieldQuantity: 0 };

    const employees = phase.employees ?? [];
    const phaseHasEmployees = employees.length > 0;

    const isDateFilled = !!phase.start_date;
    const isEngagementFilled = phaseHasEmployees && employees.every((el) => el.engagement);
    const isRateFilled = phaseHasEmployees && employees.every((el) => +el.rate);
    const isRoleFilled = phaseHasEmployees && employees.some((el) => el.role);
    const isStaffFilled = phaseHasEmployees && employees.every((el) => el.employee_id);
    const isDurationFilled =
      type === 'monthly'
        ? !!(phase.months || phase.days)
        : phaseHasEmployees && employees.every((el) => el.duration);

    const allFieldsArray = [
      isEngagementFilled,
      isRoleFilled,
      isStaffFilled,
      isDateFilled,
      isDurationFilled,
    ];

    if (!isProjectInternal) {
      allFieldsArray.push(isRateFilled);
    }

    const allFieldsCount = allFieldsArray.length;

    const progressList = [
      { title: 'Start date', filled: isDateFilled },
      { title: 'Add roles', filled: isRoleFilled },
      { title: 'Add durations on each role', filled: isDurationFilled },
      { title: 'Add engagement on each role', filled: isEngagementFilled },
      { title: 'Add staffing on each role', filled: isStaffFilled },
    ];

    if (!isProjectInternal) {
      progressList.splice(4, 0, { title: 'Add hourly rates', filled: isRateFilled });
    }

    const filledFieldsCount = allFieldsArray.filter(Boolean).length;

    const filledPercent = (filledFieldsCount / allFieldsCount) * 100;

    form.setValue(`phase.${i}.ready_to_book`, filledPercent == 100);

    return {
      filledPercentage: filledPercent,
      fieldQuantity: filledFieldsCount,
      allFieldsCount,
      progressList,
    };
  };

  const calculateReadyToBookPhases = () => {
    let readyToBook = 0;
    fields?.map((phase, i) => {
      if (
        calculateProgress(i, form.getValues(`phase.${i}.type`) as Billing).filledPercentage === 100
      ) {
        readyToBook++;
      }
    });

    return readyToBook;
  };

  const readyToBookPhases = calculateReadyToBookPhases();

  const deleteTermHandler = async (termId: number) => {
    await deleteBudgetTerm(getCookie('token'), termId);
  };
  const removePhaseHandler = async (termId: number, i?: number) => {
    if (setBudgetPhaseListingItemEdited) {
      setBudgetPhaseListingItemEdited(true);
    }

    const allTerms = form.getValues('phase');

    let filteredTerms = allTerms.filter((el) => el.id != termId);

    if (allTerms.length === 1) {
      filteredTerms = filteredTerms.filter((el) => el.id);
    }

    form.setValue('selected_term', 'all');
    setSelectedTermId(null);
    const { startDate, endDate } = determineBudgetDates(filteredTerms);
    updateBudgetDates?.(startDate, endDate);

    if (publishedBudgetIsInEditMode) {
      remove(i);
      await editPhasesHandler(editPhaseId);
    } else {
      if (termId) {
        deleteTermHandler(termId);
      }

      form.setValue('phase', filteredTerms);
    }

    setBudgetIsUpdated((prev) => !prev);
  };

  const setStatusToPhaseHandler = (isBook: boolean, status: TermStatus) => {
    if (publishedBudgetIsInEditMode) {
      if (status === 'booked' || status === 'book') return 'book';
      if (status === 'actual' || status === 'activate') return 'activate';
      return 'book';
    } else {
      return isBook ? 'book' : 'activate';
    }
  };

  const openBookModal = (isBook: boolean) => {
    setIsBookModalOpen(true);
    form.getValues('phase')?.forEach((item, i) => {
      if (item.ready_to_book) {
        form.setValue(
          `phase.${i}.status`,
          setStatusToPhaseHandler(isBook, item.status) as 'book' | 'activate',
        );
      }
    });
  };

  const closeBookModal = () => {
    setIsBookModalOpen(false);

    if (router.query.budgetId && !publishedBudgetIsInEditMode) {
      form.getValues('phase')?.forEach((item, i) => {
        if (item.ready_to_book) {
          form.setValue(`phase.${i}.status`, 'draft');
        }
      });
    }
  };

  const setPhaseStatusAfterPublish = (terms: PhasesForm[]) => {
    form.getValues('phase')?.forEach((item, i) => {
      form.setValue(
        `phase.${i}.status`,
        setStatusToPhaseHandler(false, terms?.[i]?.status) as 'book' | 'activate',
      );
    });
  };

  const publishBudget = async () => {
    try {
      setIsSuccessOpen(true);
      let data = {
        ...projectData,
        internal_project_id: (projectData.internal_project_id as { id: number }).id,
        owner_id: projectData.owner?.id,
        project_title:
          (projectData.internal_project_id as { title: string })?.title ?? projectData.title,
      };

      delete data.terms;

      const response = await savePublishedBudget(
        getCookie('token'),
        projectData.id!,
        data as unknown as BudgetForm,
      );

      setPublishedBudgetIsInEditMode(false);
      setProjectId((response as unknown as { internal_project_id: number }).internal_project_id);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const deleteScope = async () => {
    router.push('/budget');
    const budgetId = router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!;
    try {
      if (publishedBudgetIsInEditMode) {
        await archiveBudget(getCookie('token'), budgetId);
      } else {
        await deleteBudget(getCookie('token'), budgetId);
      }
    } catch (e) {
      toastGeneralError(e);
    }
  };

  return {
    form,
    phases,
    setIsOpen,
    isOpen,
    fields,
    appendNewPhase,
    budgetIsUpdated,
    setBudgetIsUpdated,
    calculateProgress,
    readyToBookPhases,
    selectedTermId,
    setSelectedTermId,
    totalNav,
    setTotalNav,
    getBudgetingPhasesHandler,
    subtotalEditIsActive,
    setSubtotalEditIsActive,
    removePhaseHandler,
    isBookModalOpen,
    setIsBookModalOpen,
    openBookModal,
    publishedBudgetData,
    setPublishedBudgetData,
    isSuccessOpen,
    setIsSuccessOpen,
    createNewPhase,
    append,
    monthlyEditIsActive,
    setMonthlyEditIsActive,
    publishBudget,
    projectId,
    setPhaseStatusAfterPublish,
    editPhaseId,
    budgetTotal,
    setBudgetTotal,
    closeBookModal,
    budgetPhaseListingItemEdited,
    setBudgetPhaseListingItemEdited,
    openDeleteScopeModal,
    deleteScopeModalIsOpen,
    setDeleteScopeModalIsOpen,
    deleteScope,
    isProjectInternal,
    isInitialRender,
  };
};
