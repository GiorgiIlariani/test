'use client';

import { can } from 'helpers';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import { BudgetForm, Permission } from 'types';

export const useBudgetPage = (
  publishedBudgetIsInEditMode: boolean,
  permissions: Permission[],
  isCreateMode?: boolean,
) => {
  const { getValues, register, setValue, reset } = useFormContext<BudgetForm>();

  const router = useRouter();
  const editPhaseId = Number(router.query.termId);

  const isPublished = getValues('status') === 'published';

  const isReadonly =
    (isPublished && (!publishedBudgetIsInEditMode || !!editPhaseId)) ||
    (isCreateMode && !can('project::create', permissions)) ||
    (!isCreateMode && !can('project::update', permissions));

  const projectId =
    typeof getValues('internal_project_id') === 'number'
      ? getValues('internal_project_id')
      : (getValues('internal_project_id') as { id: string | number | null; title: string })?.id;

  function getWidthClass(): string {
    const titleLength = getValues('title').length;

    switch (true) {
      case titleLength > 26:
        return 'w-40';
      case titleLength > 22:
        return 'w-36';
      case titleLength > 18:
        return 'w-32';
      case titleLength > 14:
        return 'w-28';
      case titleLength > 10:
        return 'w-24';
      case titleLength > 6:
        return 'w-20';
      default:
        return 'w-16';
    }
  }

  return {
    getValues,
    register,
    isReadonly,
    setValue,
    reset,
    editPhaseId,
    projectId,
    getWidthClass,
    isPublished,
  };
};
