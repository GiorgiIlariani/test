'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { can, formatDateForBack, toastGeneralError } from 'helpers';
import {
  Notification,
  Permission,
  ProjectDashboard,
  ProjectForm,
  ProjectInvoicesBudget,
  ProjectRevenueWidget,
  StaffMinimalEmployee,
  TimeSheetTableInitial,
  UnpublishedBudgets,
} from 'types';
import { getCookie } from 'cookies-next';
import {
  createBudget,
  getBudgetWidget,
  getInvoicesBudget,
  getProjectDashboard,
  getProjectRevenue,
  getProjectRevenueRequest,
  getRemindersWidget,
} from 'services';
import { useRouter } from 'next/router';
import { PROJECT_TYPE } from 'config';

export const useProjectPlanDashboard = (
  projectState: ProjectForm,
  projectId: number,
  permissions: Permission[],
) => {
  const [projectSetupIsOpen, setProjectSetupIsOpen] = useState(false);
  const router = useRouter();

  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState(false);
  const [isLoadingInvoicesBudget, setIsLoadingInvoicesBudget] = useState(false);
  const [revenue, setRevenue] = useState<ProjectRevenueWidget>();
  const [projectInfo, setProjectInfo] = useState<TimeSheetTableInitial>();
  const [invoicesBudget, setInvoicesBudget] = useState<ProjectInvoicesBudget>();
  const [budgets, setBudgets] = useState<UnpublishedBudgets>();
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(false);
  const [reminders, setReminders] = useState<Notification[]>();
  const [isLoadingReminders, setIsLoadingReminders] = useState(false);
  const [projectTeam] = useState<StaffMinimalEmployee[]>();
  const [isLoadingProjectTeam] = useState(false);
  const [projectRevenue, setProjectRevenue] = useState<ProjectDashboard>();
  const [projectRevenueIsLoading, setProjectRevenueIsLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      from: formatDateForBack(new Date(new Date().getFullYear(), 0, 1)),
      to: formatDateForBack(new Date(new Date().getFullYear(), 11, 31)),
      revenue: {
        chart_type: 'Revenue/Profit',
        chart_period: 'Monthly',
      },
    },
    mode: 'onSubmit',
  });

  const [dates, setDates] = useState({
    startDate: new Date(form.getValues('from')),
    endDate: new Date(form.getValues('to')),
  });

  const fetchRevenue = async () => {
    try {
      setIsLoadingRevenue(true);
      const revenueData = await getProjectRevenue(
        getCookie('token'),
        form.getValues('from'),
        form.getValues('to'),
        projectId,
        1,
      );
      form.setValue('from', revenueData.start_date);
      form.setValue('to', revenueData.end_date);
      setDates({
        startDate: new Date(revenueData.start_date),
        endDate: new Date(revenueData.end_date),
      });
      setRevenue(revenueData);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsLoadingRevenue(false);
    }
  };

  const fetchProjectInfo = async () => {
    try {
      setIsLoadingProjectInfo(true);
      const data = await getProjectDashboard(getCookie('token'), projectId);

      setProjectInfo(data);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsLoadingProjectInfo(false);
    }
  };

  const fetchProjectRevenue = async () => {
    try {
      setProjectRevenueIsLoading(true);
      const data = await getProjectRevenueRequest(getCookie('token'), projectId);

      setProjectRevenue(data);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setProjectRevenueIsLoading(false);
    }
  };

  const fetchInvoicesBudget = async () => {
    try {
      setIsLoadingInvoicesBudget(true);
      const data = await getInvoicesBudget(getCookie('token'), projectId);

      setInvoicesBudget(data);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsLoadingInvoicesBudget(false);
    }
  };

  const fetchRevenueCallBack = async (from: string, to: string) => {
    const revenueData = await getProjectRevenue(getCookie('token'), from, to, projectId);
    setRevenue(revenueData);
  };

  const fetchBudgets = async () => {
    try {
      setIsLoadingBudgets(true);
      const budgetsData = await getBudgetWidget(getCookie('token'), projectId);
      setBudgets(budgetsData);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsLoadingBudgets(false);
    }
  };

  const fetchReminders = async () => {
    try {
      setIsLoadingReminders(true);
      const remindersData = await getRemindersWidget(getCookie('token'), projectId);
      setReminders(remindersData);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setIsLoadingReminders(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
    fetchProjectRevenue();
    fetchInvoicesBudget();
    can('reminders::view', permissions) && fetchReminders();
    can('unpublished-budgets::view', permissions) && fetchBudgets();
  }, []);

  const revenueHeaderNames: { id: 'cost' | 'profit' | 'revenue'; title: string }[] = [
    { id: 'revenue', title: 'Revenue' },
    { id: 'cost', title: 'Cost' },
    { id: 'profit', title: 'Profit' },
  ];

  const budgetRedirectLink = useCallback(async () => {
    if (Boolean(projectState?.budgets?.length)) {
      const budgetId = projectState?.budgets?.[0]?.id;

      return await router.push(`/budget/${budgetId}`);
    } else {
      try {
        const response = await createBudget(getCookie('token'), {
          internal_project_id: projectId,
          title: '',
          rate_card_id: null,
          currency: 'USD',
          project_title: '',
          owner_id: '',
          status: 'unpublished',
          selected_term: '',
          subtotal: '',
          description: '',
          are_public_holidays_counted: false,
          project_type: PROJECT_TYPE.DEFAULT,
        });
        return await router.push(`/create-budget?budgetId=${response.budget_id}`);
      } catch (error) {
        toastGeneralError(error, router);
      }
    }
  }, [projectId, projectState?.budgets, router]);

  const projectSetupFields = useMemo(() => {
    return [
      {
        heading: (
          <p>
            <span onClick={budgetRedirectLink} className='hover:underline cursor-pointer'>
              Budget{' '}
            </span>
          </p>
        ),
        href: '#',
        isComplete: Boolean(projectState?.budgets?.length),
        fields: [],
      },
    ];
  }, [projectState, budgetRedirectLink]);

  const [completedFields, progress] = (() => {
    const setupProgress = projectSetupFields.filter((p) => p.isComplete).length;

    return [setupProgress, (setupProgress * 100) / projectSetupFields.length];
  })();

  const otherModalIsOpen = router.query.addProject;

  return {
    revenue,
    projectInfo,
    invoicesBudget,
    budgets,
    reminders,
    isLoadingRevenue,
    isLoadingProjectInfo,
    isLoadingInvoicesBudget,
    isLoadingBudgets,
    isLoadingReminders,
    completedFields,
    progress,
    projectSetupFields,
    fetchRevenue,
    fetchInvoicesBudget,
    fetchBudgets,
    fetchReminders,
    revenueHeaderNames,
    fetchRevenueCallBack,
    projectSetupIsOpen,
    setProjectSetupIsOpen,
    projectTeam,
    isLoadingProjectTeam,
    form,
    setRevenue,
    otherModalIsOpen,
    dates,
    setDates,
    projectRevenue,
    fetchProjectInfo,
    projectRevenueIsLoading,
  };
};
