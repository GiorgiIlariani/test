'use client';

import { isSortable } from '@dnd-kit/react/sortable';
import { getCookie } from 'cookies-next';
import { analytics, handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { createNewCourses, deleteCourses, editCourses } from 'services';
import { Courses, ShowPageEmployee } from 'types';

export const useCourseSection = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
  sectionName: string,
) => {
  const form = useForm({
    defaultValues: {
      courses: employee.courses
        ?.sort((a, b) => a?.order! - b?.order!)
        ?.map((item, i) => ({
          ...item,
          course_id: item.id,
          current: !!item.start_date && !item.end_date,
          order: !item.order ? i + 1 : item.order,
          delete_existing_file: 0,
        })),
    },
    mode: 'onSubmit',
  });

  const { fields, move } = useFieldArray({
    name: 'courses',
    control: form.control,
  });
  const [loading, setIsLoading] = useState(false);
  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const toggleReorderModal = () => {
    setIsReorderModalOpen((prev) => !prev);
    analytics.track(`Profile Section Reorder - ${sectionName}`);
  };

  const router = useRouter();

  const onDragEnd = (event: any) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source.sortable;

      if (initialIndex !== index) {
        move(initialIndex, index);

        form.getValues('courses')?.forEach((_, i) => {
          form.setValue(`courses.${i}.order`, i + 1);
        });
      }
    }
  };

  const handleReorder = async () => {
    try {
      const formattedList = fields?.map((item, i) => {
        return {
          ...item,
          order: i + 1,
          id: item.course_id as number,
          certification: '',
        };
      });
      if (formattedList.length) {
        await editCourses(getCookie('token'), employee.id, {
          courses: formattedList,
        });
      }
      refetchEmployeeData();
      toggleReorderModal();
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    setRemovedItems([]);
    analytics.track(`Profile Section Edit - ${sectionName}`);
  };

  const submitHandler = async (data: Courses[], form: UseFormReturn<{ courses: Courses[] }>) => {
    let updated: Courses[] = [];
    let added: Courses[] = [];
    try {
      setIsLoading(true);
      if (await form.trigger(['courses'], { shouldFocus: true })) {
        data.forEach((element) => {
          if (!element.course_id) {
            added.push(element);
          } else if (
            form.formState.dirtyFields.courses?.some((item) => !item.hasOwnProperty('course_id'))
          ) {
            updated.push(element);
          }
        });

        if (removedItems.length) {
          await deleteCourses(getCookie('token'), employee.id, { ids: removedItems });
        }

        if (added.length) {
          await createNewCourses(getCookie('token'), employee.id, { courses: added });
        }

        if (updated.length) {
          await editCourses(getCookie('token'), employee.id, {
            courses: updated.map((item) => ({
              ...item,
              delete_existing_file: !item.certification ? 1 : 0,
              id: item.course_id,
            })),
          });
        }

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

  return {
    form,
    submitHandler,
    setRemovedItems,
    toggleModal,
    isModalOpen,
    isReorderModalOpen,
    toggleReorderModal,
    handleReorder,
    fields,
    onDragEnd,
    loading,
  };
};
