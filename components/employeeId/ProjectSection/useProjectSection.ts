'use client';

import { useState } from 'react';
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { Project, ShowPageEmployee } from 'types';
import { analytics, toastGeneralError } from 'helpers';
import { createUserProjects, deleteUserProjects, editUserProjects } from 'services';
import { appendAddedToFormData, appendUpdatedToFormData } from './helpers';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { isSortable } from '@dnd-kit/react/sortable';

export const useProjectSection = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
  sectionName: string,
) => {
  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const form = useForm<{ projects: Project[] }>({
    defaultValues: {
      projects: employee.projects
        ?.sort((a, b) => a?.order! - b?.order!)
        ?.map((item, i) => ({
          skills: item.skills ?? [],
          project_id: item.id,
          updated: false,
          is_currently_working: Boolean(item?.is_currently_working),
          file: item.media,
          media: item.media,
          company: item.company,
          description: item.description,
          responsibility: item.responsibility,
          end_date: item.end_date,
          start_date: item.start_date,
          id: item.id,
          industry: item.industry,
          role: item.role,
          title: item.title,
          delete_existing_file: false,
          media_link: item.media_link,
          industry_id: item.industry?.id!,
          order: !item.order ? i + 1 : item.order,
        })),
    },
    mode: 'onSubmit',
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  const onDragEnd = (event: any) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source.sortable;

      if (initialIndex !== index) {
        move(initialIndex, index);

        form.getValues('projects')?.forEach((_, i) => {
          form.setValue(`projects.${i}.order`, i + 1);
        });
      }
    }
  };

  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const toggleReorderModal = () => {
    setIsReorderModalOpen((prev) => !prev);
    analytics.track(`Profile Section Reorder - ${sectionName}`);
  };

  const router = useRouter();

  const handleProjectReorder = async () => {
    try {
      const formattedList = fields.map((item, i) => ({
        ...item,
        order: i + 1,
        id: item.project_id as number,
      }));
      if (formattedList.length) {
        let updatedFormData = appendUpdatedToFormData(
          formattedList?.map((item) => ({
            ...item,
            is_currently_working: item.is_currently_working ? '1' : '0',
          })),
        );
        await editUserProjects(getCookie('token'), employee.id, updatedFormData);
      }

      refetchEmployeeData();
      toggleReorderModal();
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    analytics.track(`Profile Section Edit - ${sectionName}`);
    setRemovedItems([]);
  };

  const submitHandler = async (data: Project[], form: UseFormReturn<{ projects: Project[] }>) => {
    let updated: Project[] = [];
    let added: Project[] = [];

    try {
      setIsLoading(true);
      if (await form.trigger(['projects'], { shouldFocus: true })) {
        data.forEach((element) => {
          if (!element.project_id) {
            added.push(element);
          } else if (
            form.formState.dirtyFields.projects?.some((item) => !item.hasOwnProperty('project_id'))
          ) {
            updated.push(element);
          }
        });

        if (removedItems.length) {
          await deleteUserProjects(getCookie('token'), employee.id, { ids: removedItems });
        }

        if (added.length) {
          let addedFormData = appendAddedToFormData(
            added?.map((item) => ({
              ...item,
              is_currently_working: item.is_currently_working ? '1' : '0',
            })),
          );
          await createUserProjects(getCookie('token'), employee.id, addedFormData);
        }

        if (updated.length) {
          let updatedFormData = appendUpdatedToFormData(
            updated?.map((item) => ({
              ...item,
              is_currently_working: item.is_currently_working ? '1' : '0',
            })),
          );

          await editUserProjects(getCookie('token'), employee.id, updatedFormData);
        }

        refetchEmployeeData();
        toggleModal();
      }
      setIsLoading(false);
    } catch (error: any) {
      !error.response?.data?.errors['projects.0.file']?.length && toastGeneralError(error, router);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isReorderModalOpen,
    toggleReorderModal,
    handleProjectReorder,
    fields,
    onDragEnd,
    submitHandler,
    setRemovedItems,
    toggleModal,
    isModalOpen,
    loading,
    setIsLoading,
  };
};
