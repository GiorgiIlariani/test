'use client';

import { getCookie } from 'cookies-next';
import {
  analytics,
  convertMonthsToYearsAndMonths,
  handleBackendErrors,
  toastGeneralError,
} from 'helpers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createNewSkill, deleteSkill, editSkill } from 'services';
import { ShowPageEmployee, Skills } from 'types';
import { formatData } from './helpers';

export const useSkillSection = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
  sectionName: string,
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [loading, setIsLoading] = useState(false);

  const form = useForm<{ skills: Skills[] }>({
    defaultValues: {
      skills: employee?.skills?.map((item) => ({
        ...item,
        id: item.id,
        skill_id: item.id,
        competency_rate: item.pivot?.competency_rate == 5 ? 4 : item.pivot?.competency_rate,
        title: (
          item.title as {
            en: string;
            ka: string;
          }
        )?.en,
        years_of_experience: convertMonthsToYearsAndMonths(
          item.pivot?.experience_duration as number,
        ).years,
        months_of_experience: convertMonthsToYearsAndMonths(
          item.pivot?.experience_duration as number,
        ).months,
        is_preferred: item.pivot?.is_preferred,
        canNotEdit: true,
        skill_order: item.pivot?.skill_order,
      })) as Skills[],
    },
    mode: 'onSubmit',
  });

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    analytics.track(`Profile Section Edit - ${sectionName}`);
  };

  const submitHandler = async (data: Skills[]) => {
    let updated: Skills[] = [];
    let added: Skills[] = [];
    try {
      setIsLoading(true);
      const dataHasErrors = data.some(
        (item) =>
          !item.skill_id &&
          (item?.years_of_experience ||
            item?.months_of_experience ||
            item?.is_preferred ||
            item?.competency_rate),
      );

      if (!dataHasErrors) {
        data.forEach((element) => {
          if (!element.skill_id) {
            return;
          } else if (element.isNew) {
            added.push(element);
          } else {
            updated.push(element);
          }
        });

        removedItems.length &&
          (await deleteSkill(getCookie('token'), employee.id, { skill_ids: removedItems }));

        added.length &&
          (await createNewSkill(getCookie('token'), employee.id, { skills: formatData(added) }));

        updated.length &&
          (await editSkill(getCookie('token'), employee.id, {
            skills: formatData(updated),
          }));

        refetchEmployeeData();
        toggleModal();
      }
      setIsLoading(false);
    } catch (e: any) {
      if (e?.message.includes('frontValidation')) return;
      if (!('response' in e)) return toastGeneralError(e);
      if (e.response?.status === 422)
        handleBackendErrors(e.response?.data.errors, form.setFocus, form.setError);
    } finally {
      setIsLoading(false);
    }
  };

  const employeeData = form.getValues();
  return {
    employeeData,
    form,
    submitHandler,
    setRemovedItems,
    toggleModal,
    isModalOpen,
    loading,
  };
};
