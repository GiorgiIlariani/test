import { addDaysToDate, formatDateWithoutYear, objectKeys, subtractDaysToDate } from 'helpers';
import { TimeSheetEmployees } from 'types';

const calculateDatesForWeeks = (
  date: string,
  realDate: string,
  i: number,
  week: number,
  currentTermEndDate: string,
) => {
  const formattedDate = new Date(date);
  const formattedRawDate = new Date(realDate);
  const formattedCurrentTermEndDate = new Date(currentTermEndDate);

  if (week === 1 && formattedDate?.getDate() !== 1) {
    const monday = subtractDaysToDate(date, formattedDate.getDay() - 1);
    const rawDate = i === 0 ? monday : addDaysToDate(monday, i);
    return {
      formattedDate: formatDateWithoutYear(rawDate),
      rawDate,
      isDisabled: rawDate < formattedRawDate || rawDate > formattedCurrentTermEndDate,
    };
  } else {
    const rawDate = i === 0 ? date : addDaysToDate(date, i);
    const isNotMonday = new Date(realDate).getDay() !== 1;
    const isNonExistentTimeLog = isNotMonday && new Date(rawDate) < new Date(realDate);
    return {
      formattedDate: formatDateWithoutYear(rawDate),
      rawDate,
      isDisabled:
        rawDate > new Date() || isNonExistentTimeLog || rawDate > formattedCurrentTermEndDate,
    };
  }
};

const isApproved = (data: TimeSheetEmployees, weekDayIndex: number, weekDate: string) => {
  return objectKeys(data.employee_calculations)?.every((item) => {
    const currentWeekDate = new Date(weekDate).setHours(0, 0, 0, 0);
    const currentWeekEntry = data?.employee_calculations?.[item]?.time_logs.find(
      (item) => new Date(item.date).setHours(0, 0, 0, 0) === currentWeekDate,
    );
    return !!currentWeekEntry?.approved;
  });
};

export const defaultValues = (
  timeTerms: TimeSheetEmployees[],
  selectedTerm: { date: string; week: number; realDate: string },
) => {
  const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
  return timeTerms.map((data) => {
    const dayData = weekDays.map((day, index) => {
      const dayIndex = index;
      const date = calculateDatesForWeeks(
        selectedTerm.date,
        data.start_date,
        dayIndex,
        selectedTerm.week,
        data.end_date,
      );

      return {
        [day]: {
          approved: isApproved(data, dayIndex, date?.rawDate as string),
          date: date?.formattedDate,
          fullDate: date?.rawDate,
          disabled: date?.isDisabled,
        },
      };
    });

    const employeeCalculations = objectKeys(data.employee_calculations)?.map((item) => ({
      first_name: data?.employee_calculations[item]?.first_name,
      last_name: data?.employee_calculations[item]?.last_name,
      employee_id: data?.employee_calculations[item]?.time_logs[0].employee_id,
      ...weekDays.reduce((acc, day, index) => {
        const logs = data?.employee_calculations[item]?.time_logs;

        const currentLog = logs.find(
          (item) =>
            new Date(item.date).setHours(0, 0, 0, 0) ===
            new Date(dayData[index][day].fullDate).setHours(0, 0, 0, 0),
        );

        acc[day] = {
          ...currentLog,
          actual_hours:
            (currentLog?.actual_hours.toString()?.length || 0) > 4
              ? Math.floor(currentLog?.actual_hours! * 100) / 100
              : currentLog?.actual_hours ?? 0,
        };
        return acc;
      }, {} as { [key in (typeof weekDays)[number]]: {} }),
    }));

    return {
      id: data.id,
      name: data.name,
      end_date: data.end_date,
      ...Object.assign({}, ...dayData),
      employee_calculations: employeeCalculations,
    };
  });
};
