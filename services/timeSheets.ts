import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';
import {
  TermTimeLogEntries,
  TimeLogEntries,
  TimeLogEntry,
  TimeSheetEmployees,
  TimeSheetTableInitial,
  WeeklyReport,
} from 'types';

export const getTimeLogs = async (
  token: CookieValueTypes,
  project: number,
): Promise<TimeSheetTableInitial> => {
  const res = await axios.get(`/time-logs/${project}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getTimeLogWeekly = async (
  token: CookieValueTypes,
  project: number,
  from: string,
  to: string,
): Promise<TimeSheetEmployees[]> => {
  const res = await axios.get(`/time-logs/${project}/${from}/${to}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const editTimeSheets = async (
  token: CookieValueTypes,
  project: number,
  data: any,
): Promise<TimeSheetEmployees[]> => {
  const res = await axios.patch(`/time-logs/${project}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateAutoApproveStatus = async (
  token: CookieValueTypes,
  projectId: number,
  auto_approve_time_logs: boolean,
): Promise<TimeSheetEmployees[]> => {
  const res = await axios.patch(
    `/time-logs/${projectId}/auto-approve`,
    { auto_approve_time_logs },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const updateAutoFillStatus = async (
  token: CookieValueTypes,
  projectId: number,
  auto_fill_time_logs: boolean,
): Promise<TimeSheetEmployees[]> => {
  const res = await axios.patch(
    `/time-logs/${projectId}/auto-fill`,
    { auto_fill_time_logs },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getTimeLogEntries = async (
  token: CookieValueTypes,
  day: string,
): Promise<{ projects: TimeLogEntries[] }> => {
  const res = await axios.get(`/time-logs/entries/${day}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getTermTimeLogEntries = async (
  token: CookieValueTypes,
  day: string,
  termId: number,
  employeeId: number,
): Promise<{ term: TermTimeLogEntries[] }> => {
  const res = await axios.get(`/time-logs/entries/${day}/${termId}/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getWeeklyLogs = async (
  token: CookieValueTypes,
  from: string,
  to: string,
): Promise<{
  weekly_report: WeeklyReport;
  total: { hours: number; minutes: number };
}> => {
  const res = await axios.get(`/time-logs/${from}/${to}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createTimeLogEntries = async (
  token: CookieValueTypes,
  data: Omit<TimeLogEntry, 'hour' | 'minutes'>,
): Promise<{
  new_entry: TimeLogEntry;
  time_log: TimeLogEntries['terms'][number]['time_logs'][number];
}> => {
  const res = await axios.post(`/time-logs/entry`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateTimeLogEntry = async (
  token: CookieValueTypes,
  entryId: number,
  data: Omit<TimeLogEntry, 'hour' | 'minutes'>,
): Promise<{
  entry: TimeLogEntry;
}> => {
  const res = await axios.patch(`/time-logs/entry/${entryId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteTimeLogEntry = async (token: CookieValueTypes, entryId: number) => {
  const res = await axios.delete(`/time-logs/entry/${entryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const publishTimeLogDay = async (token: CookieValueTypes, entry_ids: number[]) => {
  const res = await axios.post(
    `/time-logs/publish`,
    { entry_ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
