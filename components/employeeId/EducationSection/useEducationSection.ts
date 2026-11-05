'use client';

import { getCookie } from 'cookies-next';
import { analytics, handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { createNewEducations, deleteEducations, editEducations } from 'services';
import { Education, ShowPageEmployee } from 'types';
import { isSortable } from '@dnd-kit/react/sortable';

export const useEducationSection = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
  sectionName: string,
) => {
  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const toggleReorderModal = () => {
    setIsReorderModalOpen((prev) => !prev);
    analytics.track(`Profile Section Reorder - ${sectionName}`);
  };

  const router = useRouter();

  const form = useForm<{ education: Education[] }>({
    defaultValues: {
      education: employee.educations
        ?.sort((a, b) => a?.order! - b?.order!)
        ?.map((item, i) => ({
          ...item,
          education_id: item.id as number,
          current: !!item.start_date && !item.finish_date,
          order: !item.order ? i + 1 : item.order,
        })),
    },
    mode: 'onSubmit',
  });

  const { fields, move } = useFieldArray({ name: 'education', control: form.control });

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

        form.getValues('education')?.forEach((_, i) => {
          form.setValue(`education.${i}.order`, i + 1);
        });
      }
    }
  };

  const onSubmit = async (data: Education[], form: UseFormReturn<{ education: Education[] }>) => {
    let updated: Education[] = [];
    let added: Education[] = [];

    try {
      setIsLoading(true);
      if (await form.trigger(['education'], { shouldFocus: true })) {
        data.forEach((element) => {
          if (!element.education_id) {
            added.push(element);
          } else if (
            form.formState.dirtyFields.education?.some(
              (item) => !item.hasOwnProperty('education_id'),
            )
          ) {
            updated.push(element);
          }
        });

        removedItems.length &&
          (await deleteEducations(getCookie('token'), employee.id, { ids: removedItems }));

        added.length &&
          (await createNewEducations(getCookie('token'), employee.id, { education: added }));

        updated.length &&
          (await editEducations(getCookie('token'), employee.id, {
            education: updated,
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

  const handleSubmit = async () => {
    try {
      const formattedList = fields?.map((item, i) => ({
        ...item,
        order: i + 1,
        id: item.education_id as number,
      }));
      if (formattedList.length) {
        await editEducations(getCookie('token'), employee.id, {
          education: formattedList,
        });
      }
      refetchEmployeeData();
      toggleReorderModal();
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const employeeData = form.getValues();
  return {
    employeeData,
    form,
    onSubmit,
    setRemovedItems,
    toggleModal,
    isModalOpen,
    toggleReorderModal,
    isReorderModalOpen,
    handleSubmit,
    onDragEnd,
    fields,
    loading,
    setIsLoading,
  };
};
