import { getCookie } from 'cookies-next';
import { addDaysToDate, subtractDaysToDate, toastGeneralError } from 'helpers';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { getWeeklyLogs } from 'services';
import { SetState, TimeLogEntryStatus, WeeklyReport } from 'types';
import { Props } from './types';

export const useTrackerDateSection = (
  setSelectedDate: SetState<string>,
  isSaving: boolean,
  selectedDate: string,
  dateArray: Props['dateArray'],
  setDateArray: Props['setDateArray'],
) => {
  const { getValues, setValue } = useFormContext();

  const setDateHandler = (startDate: string, report: WeeklyReport) => {
    let newArray: {
      date: string;
      hours: number;
      minutes: number;
      status: TimeLogEntryStatus;
      projects: WeeklyReport['string']['projects'];
    }[] = [];
    Array.from(Array(7).keys()).forEach((i) => {
      const date = addDaysToDate(startDate, i)?.toLocaleDateString('en-CA');
      newArray?.push({
        date,
        hours: report?.[date]?.hours,
        minutes: report?.[date]?.minutes,
        status: report?.[date]?.status,
        projects: report?.[date]?.projects,
      });
    });
    return newArray;
  };

  const fetchWeeklyReport = async (start: string, end: string) => {
    try {
      const response = await getWeeklyLogs(getCookie('token'), start, end);
      setValue('total', { hours: response?.total?.hours, minutes: response?.total?.minutes });

      setDateArray(() => {
        let newArray = setDateHandler(start, response?.weekly_report);
        return newArray;
      });
      return response;
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const selectNextWeek = () => {
    const endDate = getValues('end_date');
    const newStartDate = addDaysToDate(endDate, 1)?.toLocaleDateString('en-CA');
    const newEndDate = addDaysToDate(newStartDate, 6)?.toLocaleDateString('en-CA');

    setValue('start_date', newStartDate);
    setValue('end_date', newEndDate);

    fetchWeeklyReport(newStartDate, newEndDate);
    setSelectedDate(newStartDate);
  };

  const selectPreviousWeek = () => {
    const startDate = getValues('start_date');
    const newEndDate = subtractDaysToDate(startDate, 1)?.toLocaleDateString('en-CA');
    const newStartDate = subtractDaysToDate(newEndDate, 6)?.toLocaleDateString('en-CA');

    setValue('start_date', newStartDate);
    setValue('end_date', newEndDate);

    fetchWeeklyReport(newStartDate, newEndDate);
    setSelectedDate(newStartDate);
  };

  const startDateOnOBlurHandler = () => {
    const startDate = getValues('start_date');
    const endDate = addDaysToDate(startDate, 6);
    const newEndDate = endDate?.toLocaleDateString('en-CA');
    setValue('end_date', newEndDate);
    fetchWeeklyReport(startDate, newEndDate);
    setSelectedDate(startDate);
  };
  const endDateOnOBlurHandler = () => {
    const endDate = getValues('end_date');
    const startDate = subtractDaysToDate(endDate, 6);
    const newStartDate = startDate?.toLocaleDateString('en-CA');
    setValue('start_date', newStartDate);

    fetchWeeklyReport(newStartDate, endDate);
    setSelectedDate(newStartDate);
  };

  useEffect(() => {
    fetchWeeklyReport(getValues('start_date'), getValues('end_date'));
  }, [isSaving]);

  const isDayApproved = dateArray?.find((date) => date.date == selectedDate)?.status === 'approved';

  return {
    getValues,
    setValue,
    setDateArray,
    selectPreviousWeek,
    setDateHandler,
    selectNextWeek,
    dateArray,
    startDateOnOBlurHandler,
    endDateOnOBlurHandler,
    isDayApproved,
  };
};
