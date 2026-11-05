import { getCookie } from 'cookies-next';
import { addDaysToDate, getMondayOfSpecificWeek, toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getTimeLogEntries, publishTimeLogDay } from 'services';
import { TimeLogEntries, TimeLogEntryStatus, WeeklyReport } from 'types';
import { sumOfDuration } from './helpers';

export const useTimeTrackModule = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA'));
  const [isLoading, setIsLoading] = useState(false);
  const [dateArray, setDateArray] = useState<
    {
      date: string;
      hours: number;
      minutes: number;
      status: TimeLogEntryStatus;
      projects: WeeklyReport['string']['projects'];
    }[]
  >([]);

  const currentMonday = getMondayOfSpecificWeek(new Date())?.toLocaleDateString('en-CA');

  const form = useForm<{
    start_date: string;
    end_date: string;
    total: { hours: number; minutes: number };
    projects: TimeLogEntries[];
  }>({
    defaultValues: {
      start_date: currentMonday,
      end_date: addDaysToDate(currentMonday, 6).toLocaleDateString('en-CA'),
      total: { hours: 0, minutes: 0 },
      projects: [
        {
          terms: [],
        },
      ],
    },
  });

  const getTimeLogEntriesHandler = async () => {
    try {
      setIsLoading(true);
      const response = await getTimeLogEntries(getCookie('token'), selectedDate);

      const formattedResponse = response.projects.map((project) => ({
        ...project,
        terms: project?.terms.map((term) => {
          const { hours, minutes } = sumOfDuration(term?.time_logs?.[0]?.entries);
          if (term.time_logs?.[0]?.entries?.length) {
            return {
              ...term,
              time_logs: [
                {
                  ...term.time_logs?.[0],
                  entries: term.time_logs?.[0]?.entries?.map((el) => ({
                    ...el,
                    item_id: el.id,
                    minutes: Math.floor(+el.minutes || 0),
                  })),
                },
              ],
              total: {
                hours: hours,
                minutes: minutes,
              },
            };
          } else {
            return {
              ...term,
              total: {
                hours: 0,
                minutes: 0,
              },
              time_logs: [
                {
                  ...term.time_logs?.[0],
                  entries: [
                    {
                      id: null,
                      item_id: null,
                      start_time: '',
                      end_time: '',
                      hour: '',
                      minutes: '',
                      notes: '',
                    },
                  ],
                },
              ],
            };
          }
        }),
      }));

      form.reset({
        ...form.getValues(),
        projects: formattedResponse,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toastGeneralError(error);
    }
  };

  const submitDay = async (timeLogId?: number[]) => {
    setIsSaving(true);
    try {
      const timeLogIds = timeLogId?.length ? timeLogId : getTimeLogIds();
      await publishTimeLogDay(getCookie('token'), timeLogIds);
      setIsSaving(false);
      getTimeLogEntriesHandler();
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const getTimeLogIds = () => {
    let timeLogIds: number[] = [];

    form.getValues('projects').forEach((project) => {
      project.terms.forEach((term) =>
        term.time_logs[0].entries.forEach((entry) => {
          entry.item_id && entry.status !== 'approved' && timeLogIds.push(entry.item_id);
        }),
      );
    });
    return timeLogIds;
  };

  useEffect(() => {
    getTimeLogEntriesHandler();
  }, [selectedDate]);

  let statusOfDay = dateArray?.find((date) => date.date == selectedDate)?.status;

  const isDaySubmitted = statusOfDay === 'submitted' || statusOfDay === 'approved';

  return {
    setIsSaving,
    isSaving,
    form,
    selectedDate,
    setSelectedDate,
    isLoading,
    submitDay,
    dateArray,
    setDateArray,
    isDaySubmitted,
    getTimeLogEntriesHandler,
  };
};
