'use client';

import { isSortable } from '@dnd-kit/react/sortable';
import { getCookie } from 'cookies-next';
import { analytics } from 'helpers';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { updateAchievements } from 'services';
import { Achievements, ShowPageEmployee } from 'types';

export const useAchievementSection = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
  sectionName: string,
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [value, setValue] = useState(employee.achievement);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<{ achievements: Achievements[] }>({
    defaultValues: {
      achievements: employee.achievement
        ?.sort((a, b) => a?.order! - b?.order!)
        ?.map((a, i) => ({
          ...a,
          itemId: a.itemId ?? a.id,
          order: a.order ?? i + 1,
          delete_existing_file: 0,
        })),
    },
  });

  const { fields, move, append } = useFieldArray({
    control: form.control,
    name: 'achievements',
  });

  const onDragEnd = (event: any) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source.sortable;

      if (initialIndex !== index) {
        move(initialIndex, index);

        form.getValues('achievements')?.forEach((_, i) => {
          form.setValue(`achievements.${i}.order`, i + 1);
        });
      }
    }
  };

  const toggleReorderModal = () => {
    setIsReorderModalOpen((prev) => !prev);
    analytics.track(`Profile Section Reorder - ${sectionName}`);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    analytics.track(`Profile Section Edit - ${sectionName}`);
    if (!fields.length) {
      append({
        name: '',
        organization: '',
        description: '',
        attach_link: '',
        certification: null,
        year: '',
        id: null,
        itemId: null,
        order: fields.length + 1,
        delete_existing_file: 0,
      });
    }
  };

  const handleReorder = async () => {
    try {
      setIsLoading(true);
      const formattedList = fields?.map((item, i) => ({
        ...item,
        order: i + 1,
        id: item.itemId as number,
        certification: '',
      }));
      if (formattedList.length) {
        await updateAchievements(getCookie('token'), employee.id, {
          achievements: formattedList,
        });
      }
      refetchEmployeeData();
      toggleReorderModal();
    } catch (_error) {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    value,
    fields,
    onDragEnd,
    setValue,
    isLoading,
    toggleModal,
    isModalOpen,
    handleReorder,
    toggleReorderModal,
    isReorderModalOpen,
  };
};
