import {
  calculateDifferenceBetweenTwoTime,
  calculateEndHour,
  convertHoursAndMinutesToSeconds,
  formatTime,
  toastGeneralError,
} from 'helpers';
import { ChangeEvent, useContext, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Props } from './types';
import { getCookie } from 'cookies-next';
import { createTimeLogEntries, deleteTimeLogEntry, updateTimeLogEntry } from 'services';
import { GlobalApiInfo } from 'context';
import { TermTimeLogEntries, TimeLogEntryStatus } from 'types';

export const useTrackerPhaseListingItem = (
  fieldName: string,
  projectIndex: Props['projectIndex'],
  termIndex: Props['termIndex'],
  selectedDate: Props['selectedDate'],
  remove: Props['remove'],
  setIsSaving: Props['setIsSaving'],
  setDefaultData: Props['setDefaultData'],
  updatePhaseTotalHours?: Props['updatePhaseTotalHours'],
  getTimeLogEntriesHandler?: Props['getTimeLogEntriesHandler'],
) => {
  const { setValue, getValues, control } = useFormContext();

  const { user } = useContext(GlobalApiInfo);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [start_hour, end_hour, hour, minutes, note, status] = useWatch({
    name: [
      `${fieldName}.start_time`,
      `${fieldName}.end_time`,
      `${fieldName}.hour`,
      `${fieldName}.minutes`,
      `${fieldName}.note`,
      `${fieldName}.status`,
    ],
    control,
  });

  const calculateDurationHandler = (startHour: string, endHour: string) => {
    if (start_hour && end_hour) {
      const { hours, minutes } = calculateDifferenceBetweenTwoTime(startHour, endHour);

      setValue(`${fieldName}.hour`, hours);
      setValue(`${fieldName}.minutes`, minutes);

      updatePhaseTotalHours?.(projectIndex, termIndex);

      return { hour, minutes };
    }
  };

  const onStartDateBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target?.value;
    if (!inputValue) {
      setValue(`${fieldName}.hour`, '');
      setValue(`${fieldName}.minutes`, '');
      return;
    }

    const formattedStartHour = formatTime(inputValue, true);
    setValue(`${fieldName}.start_time`, formattedStartHour, { shouldValidate: true });

    if (!end_hour) return;

    const formattedEndHour = formatTime(end_hour, true);

    if (formattedStartHour >= formattedEndHour) {
      adjustEndHour(formattedStartHour);
    } else {
      calculateDurationHandler(formattedStartHour, end_hour);
    }
  };

  const onEndDateBlur = (e: ChangeEvent) => {
    const inputValue = (e.target as HTMLInputElement)?.value;
    if (!inputValue) return;

    const formattedEndHour = formatTime(inputValue, false);
    setValue(`${fieldName}.end_time`, formattedEndHour);

    if (start_hour) {
      const formattedStartHour = formatTime(start_hour, false);

      if (formattedEndHour < formattedStartHour || formattedEndHour === formattedStartHour) {
        adjustStartHour(formattedEndHour);
      } else {
        calculateDurationHandler(start_hour, formattedEndHour);
      }
    } else if (!inputValue) {
      setValue(`${fieldName}.hour`, '');
      setValue(`${fieldName}.minutes`, '');
    }
  };

  const adjustStartHour = (formattedEndHour: string) => {
    const [hourStr, minuteStr] = formattedEndHour.split(':');
    let hours = parseInt(hourStr, 10);
    let minutes = parseInt(minuteStr, 10);

    if (minutes === 0 && hours > 0) {
      hours -= 1;
      minutes = 59;
    } else if (hours === 0) {
      hours = 23;
      minutes = 59;
    } else {
      minutes -= 1;
    }

    setValue(`${fieldName}.hour`, 0);
    setValue(`${fieldName}.minutes`, 1);

    const adjustedHour = hours < 10 ? '0' + hours : hours;
    const adjustedMinute = minutes < 10 ? '0' + minutes : minutes;

    setValue(`${fieldName}.start_time`, `${adjustedHour}:${adjustedMinute}`);
  };

  const adjustEndHour = (formattedStartHour: string) => {
    const [startHour, startMinutes] = formattedStartHour.split(':');

    if (startMinutes === '59') {
      if (startHour === '23') {
        setValue(`${fieldName}.start_time`, '23:58');
        setValue(`${fieldName}.end_time`, '23:59');
      } else {
        setValue(`${fieldName}.end_time`, `${String(+startHour + 1).padStart(2, '0')}:00`);
      }
    } else {
      const newEndHour = `${startHour}:${String(+startMinutes + 1).padStart(2, '0')}`;
      setValue(`${fieldName}.end_time`, newEndHour);
    }

    setValue(`${fieldName}.hour`, 0);
    setValue(`${fieldName}.minutes`, 1);
  };

  const onDurationChange = (hoursValue: number, minutesValue: number) => {
    let start = start_hour ? start_hour : '11:00';
    if (!start_hour) {
      setValue(`${fieldName}.start_time`, start);
    }
    let newEndHour = calculateEndHour(start, { hour: hoursValue, minutes: minutesValue });
    if (newEndHour < start) {
      adjustEndHour(start);
    } else {
      setValue(`${fieldName}.end_time`, newEndHour);
    }
    updatePhaseTotalHours?.(projectIndex, termIndex);
  };

  const onDurationHourBlur = (e: ChangeEvent) => {
    const inputValue = (e?.target as HTMLInputElement)?.value;
    if (!inputValue) return;

    let hour = 0;
    let minute = minutes ?? 0;

    if (+inputValue > 23) {
      setValue(`${fieldName}.end_time`, '23:59');
      hour = calculateDurationHandler(start_hour, '23:59')?.hour;

      return;
    }

    if (+minutes <= 59) {
      hour = +inputValue;
      setValue(`${fieldName}.hour`, hour);
    } else {
      let hours = Math.floor(+inputValue / 60);
      let minutes = +inputValue % 60;
      hour = +inputValue + hours;
      minute = minutes;
      setValue(`${fieldName}.hour`, hour);
      setValue(`${fieldName}.minutes`, minute);
    }

    onDurationChange(hour, minute);
  };

  const onDurationMinutesBlur = (e: ChangeEvent) => {
    const inputValue = (e?.target as HTMLInputElement)?.value;
    if (!inputValue) return;

    let hours = hour ?? 0;
    let minute = 0;

    let value = inputValue.length === 2 ? inputValue : `0${inputValue}`;

    if (+value > 59) {
      let hours = Math.floor(+value / 60);
      let minutes = +value % 60;

      let renewedHours = +hour + hours;

      if (renewedHours > 23) {
        hours = 23;
        minute = 59;
        setValue(`${fieldName}.hour`, hours);
        setValue(`${fieldName}.minutes`, minute);
      } else {
        hours = +hour + hours;
        minute = minutes;
        setValue(`${fieldName}.hour`, hours);
        setValue(`${fieldName}.minutes`, minute);
      }
    } else {
      minute = +value;
      setValue(`${fieldName}.minutes`, minute);
    }

    onDurationChange(hours, minute);
  };

  const createOrUpdateEntry = async (timeLogId: number) => {
    setIsSaving(true);
    try {
      if (start_hour || end_hour || note || hour || minutes) {
        const entryId = getValues(fieldName).item_id;
        const data = { ...getValues(fieldName) };
        const timeLog = getValues(`projects.${projectIndex}.terms.${termIndex}`);
        const dataToSend = {
          start_time: data.start_time,
          end_time: data.end_time,
          duration: convertHoursAndMinutesToSeconds(data.hour ?? 0, data.minutes ?? 0),
          note,
          status: 'draft' as TimeLogEntryStatus,
          term_id: timeLog?.id,
          employee_id: user?.id,
          date: selectedDate,
          time_log_id: timeLogId ?? null,
        };
        if (entryId) {
          await updateTimeLogEntry(getCookie('token'), entryId, dataToSend);
        } else {
          await createTimeLogEntries(getCookie('token'), dataToSend);
          getTimeLogEntriesHandler?.();
        }
        if (status === 'submitted' || status === 'approved') {
          getTimeLogEntriesHandler?.();
        }
      }

      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);

      toastGeneralError(error);
    }
  };

  const deleteEntryHandler = async (entryId: number, i: number) => {
    setIsSaving(true);

    try {
      remove(i);
      if (entryId) {
        await deleteTimeLogEntry(getCookie('token'), entryId);
      }

      if (setDefaultData) {
        setDefaultData((prevData: { term: TermTimeLogEntries }) => {
          const [log] = prevData.term.time_logs ?? [];

          const updatedLog = {
            ...log,
            entries: log.entries.filter((entry) => entry.id !== entryId),
          };

          return {
            term: {
              ...prevData.term,
              time_logs: [updatedLog],
            },
          };
        });
      }

      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);

      toastGeneralError(error);
    }
  };

  return {
    setValue,
    getValues,
    control,
    onStartDateBlur,
    onEndDateBlur,
    onDurationHourBlur,
    onDurationMinutesBlur,
    hour,
    minutes,
    onDurationChange,
    createOrUpdateEntry,
    deleteEntryHandler,
    deleteDialog,
    setDeleteDialog,
  };
};
