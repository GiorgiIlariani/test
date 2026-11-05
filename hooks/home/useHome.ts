'use client';

import { getCookie } from 'cookies-next';
import { can, formatDateForBack, toastGeneralError } from 'helpers';
import {
  getBenchStats,
  getBudgetWidget,
  getDepartmentsRequest,
  getInvoiceWidget,
  getRateCards,
  getRemindersWidget,
  getUtilizationWidget,
} from 'services';
import {
  BenchStats,
  Currency,
  Notification,
  Permission,
  RevenueWidgetCalculation,
  UnpaidInvoice,
  UnpublishedBudgets,
  UtilizationWidget,
} from 'types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getRevenueWidget } from 'services';

export const useHome = (permissions: Permission[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rateCards, setRateCards] = useState<{ id: number; title: string }[] | undefined>([
    {
      id: 0,
      title: 'All',
    },
  ]);
  const [departments, setDepartments] = useState<{ id: number; title: string }[] | undefined>([
    {
      id: 0,
      title: 'All',
    },
  ]);
  const [revenue, setRevenue] = useState<RevenueWidgetCalculation>();
  const [benchStats, setBenchStats] = useState<BenchStats>();
  const [utilization, setUtilization] = useState<UtilizationWidget>();
  const [reminders, setReminders] = useState<Notification[]>();
  const [invoices, setInvoices] = useState<UnpaidInvoice[]>();
  const [budgets, setBudgets] = useState<UnpublishedBudgets>();
  const [currency, setCurrency] = useState<Currency>('GEL');

  const thisQuarter = (() => {
    const currentMonth = new Date().getMonth();
    let startDate, endDate;

    if (currentMonth >= 0 && currentMonth <= 2) {
      startDate = new Date(new Date().getFullYear(), 0, 1);
      endDate = new Date(new Date().getFullYear(), 2, 31);
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      startDate = new Date(new Date().getFullYear(), 3, 1);
      endDate = new Date(new Date().getFullYear(), 5, 30);
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      startDate = new Date(new Date().getFullYear(), 6, 1);
      endDate = new Date(new Date().getFullYear(), 8, 30);
    } else {
      startDate = new Date(new Date().getFullYear(), 9, 1);
      endDate = new Date(new Date().getFullYear(), 11, 31);
    }
    return { startDate, endDate };
  })();

  const form = useForm({
    defaultValues: {
      from: formatDateForBack(thisQuarter.startDate),
      to: formatDateForBack(thisQuarter.endDate),
      revenue: {
        rate_card_id: 0,
        chart_type: 'Revenue/Gross Profit',
        chart_period: 'Monthly',
      },
      bench: {
        rate_card_id: 0,
        department_id: 0,
        from: formatDateForBack(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        to: formatDateForBack(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
      },
      utilization: {
        department_id: 0,
        chart_period: 1,
      },
    },
    mode: 'onSubmit',
  });

  const [dates, setDates] = useState({
    startDate: new Date(form.getValues('from')),
    endDate: new Date(form.getValues('to')),
  });

  const [benchDates, setBenchDates] = useState({
    startDate: new Date(form.getValues('bench.from')),
    endDate: new Date(form.getValues('bench.to')),
  });

  const [utilizationDates, setUtilizationDates] = useState({
    startDate: new Date(form.getValues('from')),
    endDate: new Date(form.getValues('to')),
  });

  const getDashboardData = async () => {
    try {
      const [rateCards, departments] = await Promise.all([
        getRateCards(getCookie('token')),
        getDepartmentsRequest(getCookie('token')),
      ]);

      setRateCards(rateCards.map((item) => ({ id: item.id as number, title: item.name })));

      const departmentsFoSelect = departments.data
        .filter((department) => department.is_billable)
        .map((item) => ({ id: item.id as number, title: item.title }));

      departmentsFoSelect.unshift({ id: 0, title: 'All' });

      setDepartments(departmentsFoSelect);

      const rateCardId = rateCards.map((item) => ({
        id: item.id as number,
        title: item.name,
      }))?.[0]?.['id'];

      form.setValue('revenue.rate_card_id', rateCardId);
      form.setValue('bench.rate_card_id', rateCardId);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const canViewRevenueWidget = can('full-capacity-report::view', permissions);
  const canViewCapacityReport = can('capacity-report::view', permissions);
  const canViewStatisticsWidgets = canViewRevenueWidget || canViewCapacityReport;

  const canViewReminders = can('reminders::view', permissions);
  const canViewProjectInvoiceList = can('project-invoice::list', permissions);
  const canViewUnpublishedBudgets = can('unpublished-budgets::view', permissions);
  const canViewInformationWidgets =
    canViewReminders || canViewProjectInvoiceList || canViewUnpublishedBudgets;

  const canViewWidgets = canViewStatisticsWidgets || canViewInformationWidgets;

  useEffect(() => {
    canViewWidgets && getDashboardData();
    canViewProjectInvoiceList && fetchInvoices();
    if (canViewCapacityReport) {
      fetchBenchStats();
      fetchUtilization();
    }
    canViewReminders && fetchReminders();
    canViewUnpublishedBudgets && fetchBudgets();
    canViewRevenueWidget && fetchRevenue();
  }, []);

  const [isLoadingBench, setIsLoadingBench] = useState(true);
  const [isLoadingUtilization, setIsLoadingUtilization] = useState(true);
  const [isLoadingReminders, setIsLoadingReminders] = useState(true);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(true);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);

  const fetchBenchStats = async (startDate?: string, endDate?: string, original: 1 | 0 = 0) => {
    try {
      setIsLoadingBench(true);
      const benchData = await getBenchStats(
        getCookie('token'),
        startDate ?? form.getValues('bench.from'),
        endDate ?? form.getValues('bench.to'),
        original,
      );
      setBenchStats(benchData);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoadingBench(false);
    }
  };

  const fetchUtilization = async (startDate?: string, endDate?: string, original: 1 | 0 = 0) => {
    try {
      setIsLoadingUtilization(true);
      const utilizationData = await getUtilizationWidget(
        getCookie('token'),
        startDate ?? form.getValues('from'),
        endDate ?? form.getValues('to'),
        original,
      );
      setUtilization(utilizationData);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoadingUtilization(false);
    }
  };

  const fetchReminders = async () => {
    try {
      setIsLoadingReminders(true);
      const remindersData = await getRemindersWidget(getCookie('token'));
      setReminders(remindersData);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoadingReminders(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setIsLoadingInvoices(true);
      const invoicesData = await getInvoiceWidget(getCookie('token'));
      setInvoices(invoicesData);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      setIsLoadingBudgets(true);
      const budgetsData = await getBudgetWidget(getCookie('token'));
      setBudgets(budgetsData);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoadingBudgets(false);
    }
  };

  const fetchRevenue = async (startDate?: string, endDate?: string, original: 1 | 0 = 0) => {
    if (!canViewRevenueWidget) return;

    try {
      setIsLoadingRevenue(true);
      const revenueData = await getRevenueWidget(
        getCookie('token'),
        startDate ?? form.getValues('from'),
        endDate ?? form.getValues('to'),
        original,
      );
      setRevenue(revenueData);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoadingRevenue(false);
    }
  };

  const revenueHeaderNames: {
    id: 'capacity' | 'adjusted_revenue' | 'total_gross_margin';
    title: string;
  }[] = [
    { id: 'capacity', title: 'Revenue potential' },
    { id: 'adjusted_revenue', title: 'Revenue' },
    { id: 'total_gross_margin', title: 'Gross Profit' },
  ];

  const fetchRevenueCallBack = async (from: string, to: string, original: 1 | 0 = 1) => {
    const revenueData = await getRevenueWidget(getCookie('token'), from, to, original);
    setRevenue(revenueData);
  };

  const refreshDashboarWithOriginalData = () => {
    fetchRevenue(formatDateForBack(dates.startDate), formatDateForBack(dates.endDate), 1);
    fetchBenchStats(
      formatDateForBack(benchDates.startDate),
      formatDateForBack(benchDates.endDate),
      1,
    );
    fetchUtilization(
      formatDateForBack(utilizationDates.startDate),
      formatDateForBack(utilizationDates.endDate),
      1,
    );
  };

  return {
    isLoading,
    setIsLoading,
    rateCards,
    setRateCards,
    departments,
    form,
    revenue,
    setRevenue,
    benchStats,
    setBenchStats,
    utilization,
    setUtilization,
    reminders,
    setReminders,
    invoices,
    budgets,
    isLoadingBench,
    isLoadingUtilization,
    isLoadingReminders,
    isLoadingInvoices,
    isLoadingBudgets,
    isLoadingRevenue,
    revenueHeaderNames,
    fetchRevenueCallBack,
    dates,
    setDates,
    currency,
    setCurrency,
    refreshDashboarWithOriginalData,
    utilizationDates,
    setUtilizationDates,
    benchDates,
    setBenchDates,

    canViewWidgets,
    canViewStatisticsWidgets,
    canViewInformationWidgets,
    canViewRevenueWidget,
    canViewCapacityReport,
    canViewReminders,
    canViewProjectInvoiceList,
    canViewUnpublishedBudgets,
  };
};
