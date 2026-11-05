import { getWorkingDays } from 'helpers';

export const validateWorkingDaysCount = (
  value: string | number | undefined,
  otherDateString: string | undefined,
  otherDateName: 'end_date' | 'start_date',
  holidays: string[],
) => {
  if (otherDateString && value) {
    const otherDate = new Date(otherDateString);
    const thisDate = new Date(value);
    const workingDays = getWorkingDays(
      otherDateName === 'start_date' ? otherDate : thisDate,
      otherDateName === 'start_date' ? thisDate : otherDate,
      holidays,
    );
    if (!workingDays) {
      return 'Cannot request vacation for 0 work days';
    }
  }
  return true;
};
