'use client';

import { getCookie } from 'cookies-next';
import {
  formatDate,
  convertNumbersAsPrice,
  toastGeneralError,
  objectKeys,
  addDaysToDate,
  getMondayOfSpecificWeek,
} from 'helpers';
import { useEffect, useState } from 'react';
import { getTimeLogs, updateAutoApproveStatus, updateAutoFillStatus } from 'services';
import { TimeSheetTable, TimeSheetUnionsForTotals } from 'types';
import { timeSheetTableTotals } from './helpers';
import { TimeSheetTableFooter } from 'components';
import { useForm } from 'react-hook-form';
import { Props } from './types';
import { useRouter } from 'next/router';

export const useTimesheetTable = (
  projectId: number,
  autoApproveTimeLogs: boolean,
  setProjectState: Props['setProjectState'],
  autoFillTimeLogs: boolean,
  projectIsLoading?: boolean,
) => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<{
    week: number;
    date: string;
    realDate: string;
  }>();
  const [timeLogs, setTimeLogs] = useState<TimeSheetTable[]>([]);

  const form = useForm({
    defaultValues: {
      auto_approve_time_logs: true,
      auto_fill_time_logs: true,
    },
    mode: 'onChange',
  });

  const router = useRouter();

  const updateTimeLogs = async () => {
    const response = await getTimeLogs(getCookie('token'), Number(projectId));
    setTimeLogs(
      objectKeys(response)
        ?.map((item) => ({ ...response[item], start_date: item }))
        ?.reverse(),
    );
    setIsTableLoading(false);
  };

  const updateAutoApproveTimeLogs = async () => {
    setIsTableLoading(true);

    try {
      await updateAutoApproveStatus(
        getCookie('token'),
        Number(projectId),
        form.getValues('auto_approve_time_logs'),
      );
      setProjectState((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          auto_approve_time_logs: !prev?.auto_approve_time_logs,
          auto_fill_time_logs: true,
        };
      });

      if (!form.getValues('auto_approve_time_logs')) {
        setIsTableLoading(false);
      } else {
        form.setValue('auto_fill_time_logs', true);
        updateTimeLogs();
      }
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const updateAutoFillTimeLogs = async () => {
    try {
      setIsTableLoading(true);
      await updateAutoFillStatus(
        getCookie('token'),
        Number(projectId),
        form.getValues('auto_fill_time_logs'),
      );
      setProjectState((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          auto_fill_time_logs: !prev?.auto_fill_time_logs,
        };
      });

      updateTimeLogs();
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const headers = [
    'Weeks',
    'Week end date',
    'Actual / Budgeted hrs',
    'Actual / Budgeted revenue',
    'Actual / Budgeted cost',
    'Actual / Budgeted margin',
    'Status',
  ];

  const getTimeSheets = async () => {
    setIsTableLoading(true);
    try {
      form.reset({
        auto_approve_time_logs: autoApproveTimeLogs,
        auto_fill_time_logs: autoFillTimeLogs,
      });
      const response = await getTimeLogs(getCookie('token'), Number(projectId));
      setTimeLogs(
        objectKeys(response)
          ?.map((item) => ({ ...response[item], start_date: item }))
          ?.reverse(),
      );
      setIsTableLoading(false);
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    !projectIsLoading && getTimeSheets();
  }, [projectId, projectIsLoading]);

  const openTimeSheetHandler = (data: { weeks: number; id: string; realDate: string }) => {
    setIsOpen(true);

    setSelectedTerm({
      week: data.weeks,
      date: getMondayOfSpecificWeek(data.id)?.toLocaleDateString('en-CA'),
      realDate: data.id,
    });
  };

  const formattedTableHeaders = headers.map((item, i) => ({
    title: item,
    isChecked: true,
    id: i,
  }));

  const getMonday = (date: string) => {
    const formattedDate = new Date(date);
    const currentWeekDay = formattedDate.getDay();

    return currentWeekDay > 0 ? 7 - currentWeekDay : 7;
  };

  const formattedData = timeLogs?.map((time, i) => ({
    id: time.start_date,
    weeks: timeLogs.length - i,
    date: formatDate(addDaysToDate(time.start_date!, getMonday(time.start_date!))),
    hours: (
      <p>
        {parseFloat(time?.actual_hours?.toFixed(2))} hrs{' '}
        <span className='text-xs text-zinc-400'>
          / {parseFloat(time.budgeted_hours?.toFixed(2))} hrs
        </span>
      </p>
    ),
    actualRevenue: (
      <p>
        ${convertNumbersAsPrice(time?.actual_revenue)}{' '}
        <span className='text-xs text-zinc-400'>
          / ${convertNumbersAsPrice(time.budgeted_revenue)}
        </span>
      </p>
    ),
    actualCosts: (
      <p>
        ${convertNumbersAsPrice(time?.actual_cost)}{' '}
        <span className='text-xs text-zinc-400'>
          / ${convertNumbersAsPrice(time.budgeted_cost)}
        </span>
      </p>
    ),
    actualMargin: (
      <p>
        ${convertNumbersAsPrice(time?.actual_profit)}{' '}
        {`(
        ${time?.actual_margin?.toFixed(1)}%) `}
        <span className='text-xs text-zinc-400'>
          / ${convertNumbersAsPrice(time?.budgeted_profit)}{' '}
          {`(${(time?.budgeted_margin).toFixed(1)}%)`}
        </span>
      </p>
    ),
    progress: !time.approved ? (
      <p className='text-sm text-zinc-700 px-[0.65rem] py-1 border border-zinc-200  rounded-md w-[4.1rem]'>
        Review
      </p>
    ) : (
      <p className='text-xs text-[#059669] w-[4.1rem] bg-[#ECFDF5] rounded-2xl px-[0.3rem] py-[0.12rem]'>
        Approved
      </p>
    ),
  }));

  const totals = timeLogs.reduce(
    (total, item) => {
      for (let key in item) {
        if (key !== 'approved' && key !== 'start_date')
          total[key as TimeSheetUnionsForTotals] += item[key as TimeSheetUnionsForTotals];
      }
      return total;
    },
    {
      actual_hours: 0,
      actual_revenue: 0,
      actual_cost: 0,
      actual_margin: 0,
      budgeted_hours: 0,
      budgeted_revenue: 0,
      budgeted_cost: 0,
      budgeted_margin: 0,
      budgeted_profit: 0,
      actual_profit: 0,
    },
  );

  const footerData = timeSheetTableTotals(totals, timeLogs?.length);

  const tableFooters = (
    <TimeSheetTableFooter
      headers={headers}
      isTableLoading={isTableLoading}
      footerData={footerData}
    />
  );

  return {
    formattedTableHeaders,
    formattedData,
    openTimeSheetHandler,
    tableFooters,
    isOpen,
    setIsOpen,
    selectedTerm,
    timeLogs,
    isTableLoading,
    getTimeSheets,
    form,
    updateAutoApproveTimeLogs,
    updateAutoFillTimeLogs,
  };
};
