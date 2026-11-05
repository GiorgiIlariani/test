import { VacationsArray, VacationStatus } from 'types';

export const calculateTotalDays = (
  employeeVacationsData: VacationsArray[],
  monthKey: string,
  status: VacationStatus,
) => {
  return employeeVacationsData.reduce((total, vacation) => {
    if (vacation.status === status) {
      const val = vacation.number_of_vacation_days_in_month?.[monthKey] ?? 0;
      return total + Number(val || 0);
    }
    return total;
  }, 0);
};

export const getVacationEmoji = (type: string, date: string): string => {
  if (type === 'sick leave') {
    return '🤒';
  }
  if (type === 'parental leave') {
    return '🤰';
  }
  if (type === 'unpaid leave') {
    return '⛔';
  }

  const month = new Date(date).getMonth();

  if (month >= 9 || month <= 2) {
    return '⛷️';
  }

  return '🌴';
};

export const isDayOff = (startDate: string, endDate: string) => {
  const start = new Date(startDate).setHours(0);
  const end = new Date(endDate).setHours(0);
  return start === end;
};

export const getDayAndMonth = (startDate: string) => {
  const date = new Date(startDate);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  return day + ' ' + month;
};
