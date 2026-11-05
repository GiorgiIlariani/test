import { sumAndExtractHoursAndMinutes } from 'helpers';
import { TimeLogEntry } from 'types';

export const sumOfDuration = (entries: TimeLogEntry[]) => {
  const hours = entries?.reduce((a, b) => +a + +b.hour, 0);
  const minutes = entries?.reduce((a, b) => +a + +b.minutes, 0);
  return sumAndExtractHoursAndMinutes(hours, minutes);
};
