'use client';

import { Props } from './types';
import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { createAchievements, deleteAchievements, updateAchievements } from 'services';
import { Achievements, SetState, ShowPageEmployee } from 'types';

export const useAchievementsModal = (
  employee: ShowPageEmployee,
  toggleModal: () => void,
  setValue: SetState<Achievements[]>,
  form: Props['form'],
  refetch: Props['refetch'],
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ids, setIds] = useState<number[]>([]);
  const [fileErrors, setFileErrors] = useState<Record<string, string[] | null> | undefined>({});

  const {
    getValues,
    formState: { defaultValues, errors },
  } = form;

  const router = useRouter();

  const token = getCookie('token');
  const handleSubmit = useCallback(
    async (data: { achievements: Achievements[] }) => {
      if (errors?.achievements) return;
      setIsLoading(true);
      const defaultLength = defaultValues?.achievements?.length;
      const mappedData = [...data.achievements].map((item, index) => ({ index, item }));
      const createList = {
        achievements: mappedData
          .filter((e) => !e.item.id)
          .reduce((acc, curr) => {
            acc[curr.index] = curr.item;
            return acc;
          }, [] as Achievements[]),
      };
      const updateList = {
        achievements: mappedData
          .filter((e) => e.item.id)
          .reduce((acc, curr) => {
            acc[curr.index] = curr.item;
            return acc;
          }, [] as Achievements[])
          .map((item) => ({ ...item, delete_existing_file: !item.certification ? 1 : 0 })),
      };

      try {
        if (createList.achievements.length) {
          await createAchievements(token, employee.id, createList);
        }
        if (ids.length) {
          await deleteAchievements(token, employee.id, ids);
        }
        if (defaultLength && updateList.achievements.length) {
          await updateAchievements(token, employee.id, updateList);
        }

        setValue(data.achievements);
        refetch();
        toggleModal();
      } catch (e: any) {
        if (e?.message.includes('frontValidation')) return;
        if (!('response' in e)) return toastGeneralError(e, router);
        if (e.response?.status !== 422) return;

        const errors = e.response?.data.errors;
        handleBackendErrors(errors, form.setFocus, form.setError);

        setFileErrors(errors);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultValues, employee.id, errors, form, ids, refetch, setValue, toggleModal, token],
  );

  useEffect(() => {
    return () => {
      form.clearErrors();
    };
  }, [form]);

  useEffect(() => {
    return () => {
      setIds([]);
    };
  }, []);

  return {
    errors,
    isLoading,
    getValues,
    handleSubmit,
    fileErrors,
    setFileErrors,
    setIds,
  };
};
