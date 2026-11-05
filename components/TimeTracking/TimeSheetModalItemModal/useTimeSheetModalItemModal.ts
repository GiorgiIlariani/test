import { getCookie } from 'cookies-next';
import {
  convertDurationFromSecond,
  convertHoursAndMinutesToSeconds,
  toastGeneralError,
} from 'helpers';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  createTimeLogEntries,
  getTermTimeLogEntries,
  publishTimeLogDay,
  updateTimeLogEntry,
} from 'services';
import { TermTimeLogEntries, TimeLogEntryStatus } from 'types';

export const useTimeSheetModalItemModal = (
  date: string,
  termId: number,
  employeeId: number,
  getModalData: () => void,
) => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultData, setDefaultData] = useState<any>();

  const form = useForm<{
    term: TermTimeLogEntries;
  }>(defaultData);

  const { append, fields, remove } = useFieldArray({
    name: `term.time_logs.0.entries`,
    control: form.control,
  });

  const timeLogsAreNotSaved =
    fields.length !== 0 && fields.every((field) => field.status === 'draft');

  const getTermTimeLogsHandler = async () => {
    try {
      setIsLoading(true);
      const response = await getTermTimeLogEntries(getCookie('token'), date, termId, employeeId);

      const term = response.term[0];

      const timeLogEntries = term?.time_logs?.[0]?.time_log_entries;

      const formattedResponse = {
        ...term,

        time_logs: timeLogEntries?.length
          ? [
              {
                ...term?.time_logs?.[0],
                entries: timeLogEntries?.map((el) => ({
                  ...el,
                  item_id: el.id,
                  start_time: truncateLastDigits(el.start_time),
                  end_time: truncateLastDigits(el.end_time),
                  hour: convertDurationFromSecond(el.duration)?.hours,
                  minutes: convertDurationFromSecond(el.duration)?.minutes,
                })),
              },
            ]
          : [
              {
                ...term?.time_logs?.[0],
                entries: [
                  {
                    id: null,
                    item_id: null,
                    start_time: '',
                    end_time: '',
                    hour: 0,
                    minutes: 0,
                    notes: '',
                  },
                ],
              },
            ],
      };
      form.reset({ term: formattedResponse });
      setDefaultData({ term: formattedResponse });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toastGeneralError(error);
    }
  };

  const cancelHandler = () => {
    form.reset(defaultData);
    setIsInEditMode(false);
  };

  useEffect(() => {
    getTermTimeLogsHandler();
  }, []);

  const addNewEntry = () => {
    append({
      start_time: '',
      end_time: '',
      hour: '',
      minutes: '',
      note: '',
      duration: 0,
      status: 'draft',
    });
  };

  const submitDay = async (timeLogIds: number[]) => {
    setIsLoading(true);
    try {
      await publishTimeLogDay(getCookie('token'), timeLogIds);
      setIsLoading(false);
      getTermTimeLogsHandler();
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const saveTimeLogEntries = async () => {
    try {
      let entryIds = fields.map((el) => el.item_id);
      form.getValues('term.time_logs.0.entries')?.forEach(async (field, i) => {
        if (field.start_time || field.end_time || field.note || field.hour || field.minutes) {
          const entryId = field.item_id;
          const data = field;
          const dataToSend = {
            start_time: data.start_time,
            end_time: data.end_time,
            duration: convertHoursAndMinutesToSeconds(data.hour ?? 0, data.minutes ?? 0),
            note: field.note,
            status: form.getValues('term.time_logs.0.approved')
              ? 'approved'
              : ('submitted' as TimeLogEntryStatus),
            term_id: termId,
            employee_id: employeeId,
            date: date,
            time_log_id: form.getValues('term.time_logs.0').id ?? null,
          };
          if (entryId) {
            await updateTimeLogEntry(getCookie('token'), entryId, dataToSend);
            submitDay(entryIds as number[]);
          } else {
            const response = await createTimeLogEntries(getCookie('token'), dataToSend);
            entryIds.push(response.new_entry.id);

            form.setValue(`term.time_logs.0.entries.${i}.item_id`, response.new_entry.id);
            submitDay(entryIds as number[]);
          }
        }
        getModalData();
      });

      setIsInEditMode(false);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const truncateLastDigits = (time: string) => {
    return time.length === 8 ? time.slice(0, 5) : time;
  };

  return {
    isInEditMode,
    setIsInEditMode,
    isLoading,
    fields,
    remove,
    form,
    cancelHandler,
    addNewEntry,
    saveTimeLogEntries,
    setIsLoading,
    timeLogsAreNotSaved,
    setDefaultData,
  };
};
