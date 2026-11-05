'use client';

import { PROJECT_TYPE } from 'config';
import { getCookie } from 'cookies-next';
import {
  addClickAwayHandler,
  formattedPhaseData,
  getBudgetApiCalls,
  getProjectsHandler,
  getQuery,
  toastGeneralError,
} from 'helpers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createBudget,
  editBudget,
  temporaryEditBudget,
  temporaryEditBudgetPhases,
} from 'services/budget';
import {
  BudgetForm,
  Budgeting,
  Currency,
  StaffMinimalEmployee,
  BudgetProject,
  PositionSeniority,
  PhasesForm,
  BudgetStatus,
  ProjectType,
} from 'types';

export const useBudgeting = (currentBudget?: Budgeting, allProjects?: BudgetProject[]) => {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<BudgetProject[]>(allProjects ?? []);
  const [rateCards, setRateCards] = useState<{ id: number; title: string }[]>([]);
  const [minimalUsers, setMinimalUsers] = useState<StaffMinimalEmployee[]>([]);
  const [roles, setRoles] = useState<PositionSeniority[]>([]);
  const [budgetId, setBudgetId] = useState<number>(
    router.route == '/create-budget' ? +router.query.budgetId! : +router.query.budget?.[0]!,
  );
  const [publishedBudgetIsInEditMode, setPublishedBudgetIsInEditMode] = useState(
    router.query.editMode === 'true',
  );
  const [shouldResetTotals, setShouldResetTotals] = useState(false);
  const [shouldResetTerms, setShouldResetTerms] = useState(false);
  const [isActionsClicked, setIsActionsClicked] = useState(false);

  const editPhaseId = Number(router.query.termId);
  const [selectedProjectData, setSelectedProjectData] = useState<BudgetProject>();
  const [rateCardUpdated, setRateCardUpdated] = useState(false);
  const [countHolidaysUpdated, setCountHolidaysUpdated] = useState(false);
  const [projectTypeUpdated, setProjectTypeUpdated] = useState(false);

  const getApiCalls = useCallback(async () => {
    setIsLoading(true);
    const data = await getBudgetApiCalls();
    setProjects(data?.projects as BudgetProject[]);
    setRateCards(data?.rateCards!);
    setMinimalUsers(data?.minimalUsers!);
    setRoles(data?.roles!);
    setIsLoading(false);
  }, []);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const toggleAdditionalButtons = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setIsActionsClicked);
    setIsActionsClicked(true);
  };

  const defaultBudgetValues = {
    id: currentBudget?.id,
    currency: currentBudget?.currency ?? 'USD',
    internal_project_id: {
      id: (currentBudget?.internal_project_id ?? null) as number,
      title: currentBudget?.project_title,
    },
    description: currentBudget?.description ?? '',
    rate_card_id: currentBudget?.rate_card_id ?? null,
    title: currentBudget?.title ?? '',
    start_date: currentBudget?.start_date ?? '',
    end_date: currentBudget?.end_date ?? '',
    status: currentBudget?.status,
    are_public_holidays_counted: currentBudget?.are_public_holidays_counted ?? false,
    project_type:
      currentBudget?.project?.type ?? currentBudget?.project_type ?? PROJECT_TYPE.DEFAULT,
    terms: [],
  };

  const form = useForm<BudgetForm>({
    defaultValues: defaultBudgetValues,
  });

  const resetToDefaultBudget = () => {
    const currentTerms = form.getValues('terms');
    form.reset({
      ...defaultBudgetValues,
      terms: currentTerms,
    });
    setShouldResetTotals(true);
    setShouldResetTerms(true);
    setPublishedBudgetIsInEditMode(false);
    const query = { ...router.query };
    delete query.editMode;

    router.replace(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true },
    );
  };

  const phaseForm = useForm<{
    phase: PhasesForm[];
    subtotal: number;
    phase_subtotal: { [key: string]: number };
    phase_monthly: { [key: string]: number };
    selected_term: string;
    profit_margin: number;
  }>({
    defaultValues: {
      phase: [
        {
          id: null,
          item_id: null,
          name: '',
          start_date: '',
          end_date: '',
          work_days_count: 0,
          type: 'default',
          discount: '0',
          employees: [],
          ready_to_book: false,
          status: 'draft',
        },
      ],
      selected_term: 'all',
      subtotal: 0,
      profit_margin: 0,
      phase_subtotal: {},
      phase_monthly: {},
    },
  });

  const updateBudgetAfterRateCardRemoved = () => {
    form.setValue('rate_card_id', null);
  };

  useEffect(() => {
    getApiCalls();
  }, [getApiCalls]);

  const onProjectTitleChangeHandler = (value: {
    id: number | string;
    title: string;
    currency?: Currency;
    type?: ProjectType;
  }) => {
    form.reset({
      ...form.getValues(),
      internal_project_id: {
        id: value.title ? value.id : null,
        title: value.title ? value.title : (value.id as string),
      },
      currency:
        (value as unknown as { currency: Currency }).currency ??
        form.getValues()?.currency ??
        'USD',
      project_type: value.type ?? form.getValues()?.project_type ?? PROJECT_TYPE.DEFAULT,
    });

    if ((form.getValues('internal_project_id') as { id: number }).id) {
      submitOnBlur(form.getValues());
      setProjectTypeUpdated((prev) => !prev);
    }

    setSelectedProjectData(projects.find((el) => el.id == value.id));
  };

  const editPhasesHandler = async (
    project: BudgetForm,
    preserveEndDate: boolean = false,
    preserveStartDate: boolean = false,
  ) => {
    try {
      let data = {
        terms: formattedPhaseData(phaseForm.getValues('phase'), preserveEndDate, preserveStartDate),
        rate_card_id: project.rate_card_id!,
        internal_project_id:
          typeof project?.internal_project_id === 'number' ? project?.internal_project_id : null,
        update_term_status: false,
        are_public_holidays_counted: project.are_public_holidays_counted,
      };

      let response;

      response = await temporaryEditBudgetPhases(
        getCookie('token'),
        router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
        data,
      );

      const budgetResponse = await temporaryEditBudget(
        getCookie('token'),
        router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
        project,
      );

      if (budgetResponse.rate_card_updated) {
        setRateCardUpdated((prev) => !prev);
      }

      if (budgetResponse.employee_duration_updated) {
        setCountHolidaysUpdated((prev) => !prev);
      }

      return response;
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const submitOnBlur = async (
    data: BudgetForm,
    preserveEndDate: boolean = false,
    preserveStartDate: boolean = false,
  ) => {
    setIsSaving(true);
    try {
      if (!(data.internal_project_id as { id: number }).id) {
        data.project_title = (data.internal_project_id as { title: string })?.title;
        data.internal_project_id = null;
      } else {
        data.internal_project_id = (data.internal_project_id as { id: number }).id!;
      }
      let response;
      if (budgetId) {
        if (!publishedBudgetIsInEditMode) {
          response = await editBudget(getCookie('token'), budgetId, data);
          if (response.rate_card_updated) {
            setRateCardUpdated((prev) => !prev);
          }
          if (response.employee_duration_updated) {
            setCountHolidaysUpdated((prev) => !prev);
          }
        } else {
          editPhasesHandler(data, preserveEndDate, preserveStartDate);
        }
      } else {
        response = await createBudget(getCookie('token'), data);

        setBudgetId(response.budget_id);
      }
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateBudgetDates = (start_date: number | null, end_date: number | null) => {
    form.reset({
      ...form.getValues(),
      start_date: start_date ? new Date(start_date)?.toLocaleDateString('en-CA') : '',
      end_date: end_date ? new Date(end_date)?.toLocaleDateString('en-CA') : '',
    });
  };

  const setProjectId = async (id: number, title: string, status: BudgetStatus = 'published') => {
    form.reset({
      ...form.getValues(),
      internal_project_id: {
        id,
        title: title,
      },

      status: status,
    });
    const projectData = await getProjectsHandler();

    if (projectData?.projects) {
      setProjects(projectData.projects as BudgetProject[]);
      setSelectedProjectData(projectData.projects.find((el) => el.id == id) as BudgetProject);
    }
  };

  const editBudgetStateChange = () => {
    setPublishedBudgetIsInEditMode(true);
  };

  return {
    form,
    isSaving,
    submitOnBlur,
    onProjectTitleChangeHandler,
    setIsSaving,
    budgetId,
    isLoading,
    setIsLoading,
    projects,
    rateCards,
    minimalUsers,
    roles,
    rateCardUpdated,
    setRateCardUpdated,
    updateBudgetAfterRateCardRemoved,
    updateBudgetDates,
    selectedProjectData,
    setProjectId,
    editBudgetStateChange,
    publishedBudgetIsInEditMode,
    setPublishedBudgetIsInEditMode,
    phaseForm,
    editPhaseId,
    shouldResetTotals,
    setShouldResetTotals,
    resetToDefaultBudget,
    shouldResetTerms,
    setShouldResetTerms,
    countHolidaysUpdated,
    setCountHolidaysUpdated,
    projectTypeUpdated,
    setProjectTypeUpdated,
    buttonRef,
    dropDownRef,
    isActionsClicked,
    setIsActionsClicked,
    toggleAdditionalButtons,
  };
};
