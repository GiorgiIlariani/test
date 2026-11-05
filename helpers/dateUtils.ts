import { FULL_MONTH_NAMES, PARTIAL_MONTH_NAMES } from 'config';

export const reconcileDate = (date: string) => {
  const dateWithSlash = date.replace(/-/g, '/');
  const reconcileDay = new Date(dateWithSlash);
  return reconcileDay;
};

export const standardizeDate = (date: Date) => date.toLocaleDateString('en-CA');

export const convertTolocaleDate = (date: Date = new Date()) => {
  const [yyyy, mm, dd] = standardizeDate(date).split('-');
  const currentDate = date.getDate();
  const checkDate = new Date(`${yyyy}-${mm}-${dd}`);

  const ONE_DAY = 24 * 60 * 60 * 1000;

  return checkDate.getDate() === currentDate
    ? standardizeDate(checkDate)
    : standardizeDate(new Date(checkDate.getTime() + ONE_DAY));
};

export const getFirstAvailableBusinessDay = (startDate: string, holidayDates: string[] = []) => {
  const date = reconcileDate(startDate);

  while (
    date.getDay() === 0 ||
    date.getDay() === 6 ||
    holidayDates.includes(convertTolocaleDate(date))
  ) {
    date.setDate(date.getDate() + 1);
  }

  return convertTolocaleDate(date);
};

export const getFullMonthNameFromPartial = (partialMonth: string) => {
  const index = PARTIAL_MONTH_NAMES.indexOf(partialMonth.toLowerCase());
  return index !== -1 ? FULL_MONTH_NAMES[index] : partialMonth;
};

export const formatMonthYear = (date: string) => {
  const [year, month] = date.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = FULL_MONTH_NAMES[monthIndex];

  return `${monthName} ${year}`;
};

export const getDraftDateIndicator = (date: string): 'overdue' | 'soon' | 'future' => {
  const logDate = reconcileDate(date);
  logDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  oneMonthFromNow.setHours(23, 59, 59, 999);

  if (logDate <= today) {
    return 'overdue';
  }
  if (logDate <= oneMonthFromNow) {
    return 'soon';
  }

  return 'future';
};
