'use client';

import { getCookie } from 'cookies-next';
import { addDaysToDate, toastGeneralError, getPositionSeniority, formatDateForBack } from 'helpers';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { editTimeSheets, getTimeLogWeekly } from 'services';
import { SetState, TRateCard, TimeSheetForm } from 'types';
import { defaultValues } from './utils';
import { useRouter } from 'next/router';

export const useTimeSheetModal = (
  selectedTerm: { date: string; week: number; realDate: string },
  projectId: number,
  setIsOpen: SetState<boolean>,
  getTimeSheets: () => void,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [roleList, setRoleList] = useState<TRateCard[]>([]);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  const form = useForm<{ terms: TimeSheetForm[] }>({
    defaultValues: {
      terms: [],
    },
  });
  const { fields } = useFieldArray({ name: 'terms', control: form.control });

  const router = useRouter();

  const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

  const selectedTermEndDate = addDaysToDate(selectedTerm?.date, 6);
  const getModalData = async () => {
    const toDate = selectedTermEndDate > new Date() ? new Date() : selectedTermEndDate;

    try {
      const timeTerms = await getTimeLogWeekly(
        getCookie('token'),
        Number(projectId),
        selectedTerm?.date,
        toDate.toLocaleDateString('en-CA'),
      );

      form.reset({ terms: defaultValues(timeTerms, selectedTerm) });
      setIsLoading(false);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    getModalData();
  }, []);

  const closeHandler = () => {
    getTimeSheets();
    setIsOpen(false);
  };

  useEffect(() => {
    (async () => {
      const seniorities = await getPositionSeniority();
      const { roles } = seniorities?.reduce(
        (acc, curr) => {
          return {
            roles: acc.roles.concat({
              id: curr?.id,
              name: curr.title,
              hourly_rate: 0,
              position: curr.position,
              seniority: curr.seniority,
            } as TRateCard),
            ids: acc.ids.concat(String(curr.id)),
          };
        },
        {
          roles: [],
          ids: [],
        } as { roles: TRateCard[]; ids: string[] },
      );
      setRoleList(roles);
    })();
  }, []);

  const onSubmit = async (data?: { terms: TimeSheetForm[] }) => {
    setIsLoading(true);
    data && setIsSubmitting(true);

    try {
      const submittedData = data ?? form.getValues();

      setIsFormDirty(false);

      let listOfLogs: {
        id: number | null;
        approved: boolean;
        actual_hours: number;
        employee_id: number | null;
        term_id?: number;
        date: string;
      }[] = [];

      submittedData?.terms?.map((term) => {
        term?.employee_calculations?.forEach((item) => {
          weekdays.forEach((week) => {
            if (item?.[week]?.id) {
              listOfLogs?.push({
                ...item?.[week],
                term_id: term.id,
                employee_id: item?.employee_id,
                actual_hours: item?.[week]?.actual_hours,
                date: formatDateForBack(term[week]?.fullDate),
                approved: !data ? !!term[week]?.approved : true,
              });
            } else if (item?.[week]?.actual_hours) {
              listOfLogs?.push({
                id: null,
                term_id: term.id,
                employee_id: item?.employee_id,
                actual_hours: item?.[week]?.actual_hours,
                date: formatDateForBack(term[week]?.fullDate),
                approved: !data ? !!term[week]?.approved : true,
              });
            }
          });
        });
      });

      await editTimeSheets(getCookie('token'), Number(projectId), { time_logs: listOfLogs });

      const timeTerms = await getTimeLogWeekly(
        getCookie('token'),
        Number(projectId),
        selectedTerm?.date,
        selectedTermEndDate.toLocaleDateString('en-CA'),
      );

      form.reset({ terms: defaultValues(timeTerms, selectedTerm) });
      setIsLoading(false);
      setIsSubmitting(false);
      setIsSaving(false);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const isFormApproved =
    form
      .getValues(`terms`)
      ?.every((item) => weekdays.every((week) => !!item[week]?.approved || item[week]?.disabled)) &&
    !isFormDirty;

  return {
    onSubmit,
    form,
    closeHandler,
    isLoading,
    roleList,
    fields,
    isFormApproved,
    weekdays,
    setIsFormDirty,
    isSubmitting,
    setIsSubmitting,
    setIsSaving,
    isSaving,
    getModalData,
  };
};
