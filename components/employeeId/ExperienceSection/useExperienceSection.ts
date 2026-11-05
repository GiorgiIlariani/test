'use client';

import { getCookie } from 'cookies-next';
import { analytics, handleBackendErrors, toastGeneralError } from 'helpers';
import { deleteExperiences, createNewExperiences, editExperiences } from 'services';
import { useState } from 'react';
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { Experiences, ShowPageEmployee } from 'types';
import { useRouter } from 'next/router';
import { isSortable } from '@dnd-kit/react/sortable';

export const useExperienceSection = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
  sectionName: string,
) => {
  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const toggleReorderModal = () => {
    setIsReorderModalOpen((prev) => !prev);
    analytics.track(`Profile Section Reorder - ${sectionName}`);
  };

  const form = useForm<{ experiences: Experiences[] }>({
    defaultValues: {
      experiences: employee.companies
        ?.sort((a, b) => a?.order! - b?.order!)
        ?.map((item, i) => ({
          ...item,
          experience_id: item.id,
          employment_type_id: item.employment_type?.id ?? null,
          industry_id: item.industry?.id ?? null,
          current: !!item.start_date && !item.end_date,
          order: !item.order ? i + 1 : item.order,
        })),
    },
    mode: 'onSubmit',
  });

  const { fields, move } = useFieldArray({
    name: 'experiences',
    control: form.control,
  });

  const saveReorderedExperiences = async () => {
    try {
      const formattedList = fields?.map((item, i) => ({
        ...item,
        order: i + 1,
        id: item.experience_id as number,
        industry_id: item.industry?.id ?? null,
        employment_type_id: item.employment_type?.id ?? null,
      }));
      if (formattedList.length) {
        await editExperiences(getCookie('token'), employee.id, {
          experiences: formattedList,
        });
      }
      refetchEmployeeData();
      toggleReorderModal();
    } catch (e: any) {
      if (e?.message.includes('frontValidation')) return;
      if (!('response' in e)) return toastGeneralError(e);
      if (e.response?.status === 422)
        handleBackendErrors(e.response?.data.errors, form.setFocus, form.setError);
    }
  };

  const router = useRouter();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    analytics.track(`Profile Section Edit - ${sectionName}`);
    setRemovedItems([]);
  };

  const onDragEnd = (event: any) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source.sortable;

      if (initialIndex !== index) {
        move(initialIndex, index);

        form.getValues('experiences')?.forEach((_, i) => {
          form.setValue(`experiences.${i}.order`, i + 1);
        });
      }
    }
  };

  const onSubmit = async (
    data: Experiences[],
    form: UseFormReturn<{ experiences: Experiences[] }>,
  ) => {
    let updated: Experiences[] = [];
    let added: Experiences[] = [];

    try {
      setIsLoading(true);
      if (await form.trigger(['experiences'], { shouldFocus: true })) {
        data.forEach((element) => {
          if (!element.experience_id) {
            added.push(element);
          } else {
            updated.push(element);
          }
        });

        removedItems.length &&
          (await deleteExperiences(getCookie('token'), employee.id, removedItems));

        added.length &&
          (await createNewExperiences(getCookie('token'), employee.id, { experiences: added }));

        updated.length &&
          (await editExperiences(getCookie('token'), employee.id, {
            experiences: updated,
          }));
        refetchEmployeeData();
        toggleModal();
      }
      setIsLoading(false);
    } catch (error: any) {
      toastGeneralError(error, router);
    } finally {
      setIsLoading(false);
    }
  };

  const employeeData = form.getValues();

  return {
    employeeData,
    form,
    setRemovedItems,
    onSubmit,
    toggleModal,
    isModalOpen,
    toggleReorderModal,
    isReorderModalOpen,
    saveReorderedExperiences,
    fields,
    onDragEnd,
    loading,
    setIsLoading,
  };
};
