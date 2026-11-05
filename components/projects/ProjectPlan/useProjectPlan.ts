'use client';
import { getCookie } from 'cookies-next';
import { analytics, formatBudgetPhaseData, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createBudget, getProjectPlan } from 'services';
import { BudgetStatus, PhasesForm, ProjectForm } from 'types';

export const useProjectPlan = (projectState: ProjectForm) => {
  const [totalNav, setTotalNav] = useState('total');
  const [selectedScopeId, setSelectedScopeId] = useState<number | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [projectIsUpdated, setProjectIsUpdated] = useState(false);
  const [budgetIsLoading, setBudgetCreationLoading] = useState(false);
  const [termsAndBudgetsIsLoading, setTermsAndBudgetsIsLoading] = useState(true);

  const [isOpen, setIsOpen] = useState<number | undefined>();
  const router = useRouter();
  const projectId = +router.query?.project?.[0]!;

  const createBudgetHandler = async () => {
    setBudgetCreationLoading(true);
    try {
      const response = await createBudget(getCookie('token'), {
        internal_project_id: projectId,
        title: '',
        rate_card_id: null,
        currency: projectState.currency,
        project_title: projectState.title,
        owner_id: projectState.owner_id,
        status: 'unpublished',
        selected_term: '',
        subtotal: '',
        description: '',
        are_public_holidays_counted: false,
        project_type: projectState.type,
      });
      analytics.track('Project page - Draft new scope');

      router.push(`/create-budget?budgetId=${response.budget_id}`);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const form = useForm<{
    budgets: { phase: PhasesForm[]; id: number | null; title: string; status: BudgetStatus }[];
    subtotal: number;
    phase_subtotal: { [key: string]: number };
    selected_term: string;
    profit_margin: number;
  }>({
    defaultValues: {
      budgets: [
        {
          id: null,
          title: 'Untitled',
          status: 'published',
          phase: [
            {
              id: null,
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
        },
      ],

      selected_term: 'all',
      subtotal: 0,
      profit_margin: 0,
      phase_subtotal: {},
    },
  });

  const getTermsAndBudgets = async () => {
    setTermsAndBudgetsIsLoading(true);
    try {
      const token = getCookie('token');
      const projectData = await getProjectPlan(token, projectId, 1);

      const formattedResponse = formatBudgetPhaseData(
        projectData.data?.terms as unknown as PhasesForm[],
      );

      const budgets = projectData.data?.budgets?.map((budget) => ({
        id: budget.id,
        status: budget.status,
        title: budget.title,
        phase: formattedResponse.filter((el) => el.budget_id == budget.id),
      }));

      if (formattedResponse.length) {
        form.reset({ budgets: budgets });
      } else {
        form.reset({ budgets: [] });
      }
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setTermsAndBudgetsIsLoading(false);
    }
  };

  useEffect(() => {
    getTermsAndBudgets();
  }, []);

  return {
    totalNav,
    setTotalNav,
    selectedScopeId,
    setSelectedScopeId,
    selectedTermId,
    setSelectedTermId,
    isOpen,
    setIsOpen,
    router,
    projectIsUpdated,
    setProjectIsUpdated,
    budgetIsLoading,
    createBudgetHandler,
    termsAndBudgetsIsLoading,
    form,
    setTermsAndBudgetsIsLoading,
    getTermsAndBudgets,
  };
};
