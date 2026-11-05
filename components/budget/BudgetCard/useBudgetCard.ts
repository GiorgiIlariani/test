'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { can, formatDate } from 'helpers';
import { Budgeting } from 'types/Budget';
import { Permission } from 'types';
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  PencilIcon,
  SquareArrowOutUpRightIcon,
  TrashIcon,
} from 'lucide-react';

export const useBudgetCard = (
  cardInfo: Budgeting | undefined,
  unarchiveHandler: (id: number) => void,
  permissions: Permission[],
) => {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<number | null>(null);
  const [isAchieveOpen, setIsAchieveOpen] = useState<number | null>(null);
  const navigateToProject = () => {
    router.push(`projects/${cardInfo?.project.id}/plan`);
  };
  const dropDownList = (() => {
    switch (cardInfo?.status) {
      case 'published':
        return [
          {
            title: 'Go to project',
            icon: SquareArrowOutUpRightIcon,
            onClick: navigateToProject,
          },
          can('project::update', permissions)
            ? {
                title: 'Edit Budget',
                icon: PencilIcon,
                onClick: () => router.push(`/budget/${cardInfo?.id}`),
              }
            : null,
        ].filter((value) => value !== null);

      case 'archived':
        return [
          can('project::update', permissions)
            ? {
                title: 'Edit Budget',
                icon: PencilIcon,
                onClick: () => router.push(`/budget/${cardInfo?.id}`),
              }
            : null,
          can('project::update', permissions)
            ? {
                title: 'Unarchive',
                icon: ArchiveRestoreIcon,
                onClick: (id: number) => unarchiveHandler(id),
              }
            : null,
          can('project::delete', permissions)
            ? {
                title: 'Delete',
                icon: TrashIcon,
                onClick: (id: number) => setIsDeleteOpen(id),
              }
            : null,
        ].filter((value) => value !== null);

      default:
        return [
          can('project::update', permissions)
            ? {
                title: 'Edit Budget',
                icon: PencilIcon,
                onClick: () => router.push(`/budget/${cardInfo?.id}`),
              }
            : null,
          can('project::update', permissions)
            ? {
                title: 'Archive',
                icon: ArchiveIcon,
                onClick: (id: number) => setIsAchieveOpen(id),
              }
            : null,
          can('project::delete', permissions)
            ? {
                title: 'Delete',
                icon: TrashIcon,
                onClick: (id: number) => setIsDeleteOpen(id),
              }
            : null,
        ].filter((value) => value !== null);
    }
  })();

  const bookedTermCount = cardInfo?.terms?.filter((terms) => terms.status === 'booked').length;
  const activeTermCount = cardInfo?.terms?.filter((terms) => terms.status === 'actual').length;
  const draftTermCount = cardInfo?.terms?.filter((terms) => terms.status === 'draft').length;

  const getStaffProgressStatus = () => {
    const { progress } = cardInfo || {};

    if (progress === 100) return 'Fully staffed';
    if (progress && progress > 0 && progress < 100) return 'Partially staffed';
    if (progress === 0) return 'Not staffed';
    return '';
  };

  const staffedStatus = getStaffProgressStatus();

  const startDate = cardInfo?.start_date;
  const endDate = cardInfo?.end_date;
  const dateRange =
    startDate || endDate
      ? `${startDate ? formatDate(startDate) : 'Not set'} - ${
          endDate ? formatDate(endDate) : 'Not set'
        }`
      : 'No dates';

  return {
    dropDownList,
    bookedTermCount,
    activeTermCount,
    draftTermCount,
    staffedStatus,
    router,
    isDeleteOpen,
    setIsDeleteOpen,
    isAchieveOpen,
    setIsAchieveOpen,
    dateRange,
  };
};
