'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Props } from './types';
import { BookModal, BudgetForm, BudgetProject, Currency, PhasesForm, ProjectType } from 'types';
import {
  editBudget,
  savePublishedBudget,
  storeProjectClientRequest,
  temporaryEditBudgetPhases,
} from 'services';
import { getCookie } from 'cookies-next';
import { analytics, formattedPhaseData, getQuery, toastGeneralError } from 'helpers';
import router from 'next/router';

export const useBookModal = (
  budgetData: Props['budgetData'],
  projectData: Props['projectData'],
  setIsSuccessOpen: Props['setIsSuccessOpen'],
  setPublishedBudgetData: Props['setPublishedBudgetData'],
  setIsBookModalOpen: Props['setIsBookModalOpen'],
  setProjectId: Props['setProjectId'],
  getBudgetingPhasesHandler: Props['getBudgetingPhasesHandler'],
  publishedBudgetIsInEditMode: Props['publishedBudgetIsInEditMode'],
  setPublishedBudgetIsInEditMode: Props['setPublishedBudgetIsInEditMode'],
  setPhaseStatusAfterPublish: Props['setPhaseStatusAfterPublish'],
  arePublicHolidaysCounted: boolean,
  budgetForm: Props['budgetForm'],
  projects: BudgetProject[],
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProjectCurrency, setSelectedProjectCurrency] = useState<Currency>(
    projectData.currency ?? 'USD',
  );
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>(
    projectData.project_type ?? 'default',
  );

  const currentBudgetFromStorage: { id: number; name: string; ready_to_book: boolean }[] =
    localStorage.getItem('budget')
      ? JSON.parse(localStorage.getItem('budget') ?? '')?.[projectData.id!]
      : [];

  const publishedPhase = budgetData?.phase
    ?.filter((phase) =>
      currentBudgetFromStorage?.length
        ? currentBudgetFromStorage?.find((el) => el.id === phase.item_id)?.ready_to_book
        : true && phase?.ready_to_book,
    )
    .filter(Boolean);

  const draftPhase = budgetData?.phase
    ?.filter((phase) =>
      currentBudgetFromStorage?.length
        ? !currentBudgetFromStorage?.find((el) => el.id === phase.item_id)?.ready_to_book
        : true && !phase?.ready_to_book,
    )
    .filter(Boolean);

  const [selectedProject, setSelectedProject] = useState<BudgetProject | null>(null);

  const editPhaseId = Number(router.query.termId) ?? false;

  const bookForm = useForm<BookModal>({
    defaultValues: {
      ...projectData,
      project_title: !(
        projectData.internal_project_id as { id: number | string | null; title: string }
      )?.id
        ? (projectData.internal_project_id as { id: number | string | null; title: string })?.title
        : '',
      published_phase: publishedPhase,
      draft_phase: draftPhase,
      draft: 'Saved as a new scope',
      sumOfPublished: publishedPhase?.length,
      sumOfDraft: draftPhase?.length,
      currency: projectData.currency ?? 'USD',
      project_type: projectData.project_type ?? 'default',
      project_owner: projectData.owner?.id ?? null,
      department_id:
        projects.find((project) => Number(projectData.project?.id) === Number(project.id))
          ?.department_id ?? null,
      client_id:
        projects.find((project) => Number(projectData.project?.id) === Number(project.id))
          ?.client_id ?? null,
      temporary_clients: [],
      are_public_holidays_counted: projectData.are_public_holidays_counted ?? false,
    },
  });

  const { fields, remove, append } = useFieldArray({
    name: 'published_phase',
    control: bookForm.control,
  });
  const {
    fields: draftFields,
    append: draftAppend,
    remove: draftRemove,
  } = useFieldArray({
    name: 'draft_phase',
    control: bookForm.control,
  });

  const storeBudgetInLocalStorage = (
    fields: { id: number | null; name: string; ready_to_book: boolean }[],
  ) => {
    return localStorage.setItem(`budget`, JSON.stringify({ [`${projectData.id}`]: fields }));
  };

  const changeBudgetStatus = (isDraft: boolean, i: number, currentPhase: PhasesForm) => {
    if (isDraft) {
      draftRemove(i);
      append({ ...currentPhase, status: 'book' });
      bookForm.setValue('sumOfPublished', bookForm.getValues('sumOfPublished') + 1);
      bookForm.setValue('sumOfDraft', bookForm.getValues('sumOfDraft') - 1);
    } else {
      remove(i);
      draftAppend({ ...currentPhase, status: 'draft' });
      bookForm.setValue('sumOfPublished', bookForm.getValues('sumOfPublished') - 1);
      bookForm.setValue('sumOfDraft', bookForm.getValues('sumOfDraft') + 1);
    }
    const changedDraft = bookForm.getValues('draft_phase')?.map((el) => ({
      id: el.item_id,
      name: el.name,
      ready_to_book: false,
    }));

    const changedPublished = bookForm.getValues('published_phase')?.map((el) => ({
      id: el.item_id,
      name: el.name,
      ready_to_book: true,
    }));
    isDraft && analytics.track(`Budget book modal status - draft`);

    if (
      publishedBudgetIsInEditMode &&
      bookForm.getValues('sumOfPublished') &&
      ['Unpublish scope', 'Archive scope'].includes(bookForm.getValues('draft'))
    ) {
      bookForm.setValue('draft', 'Save as new scope');
    } else if (
      publishedBudgetIsInEditMode &&
      !bookForm.getValues('sumOfPublished') &&
      ['Saved as a new scope', 'Archived', 'Deleted permanently'].includes(
        bookForm.getValues('draft'),
      )
    ) {
      bookForm.setValue('draft', 'Unpublish scope');
    }

    storeBudgetInLocalStorage(changedDraft.concat(changedPublished));
  };

  const deleteBudgetDataHandler = (budgetId: number) => {
    const budgetData = JSON.parse(localStorage.getItem('budget') ?? '{}');

    if (budgetData && budgetData[budgetId]) {
      delete budgetData[budgetId];

      localStorage.setItem('budget', JSON.stringify(budgetData));
    }
  };

  const submitData = async (data: BookModal) => {
    setIsLoading(true);

    let clientId = data.client_id;

    if (data.project_type === 'default' && Number(clientId) < 0) {
      const selectedTemporaryClient = data.temporary_clients?.find(
        (client) => Number(client.id) === Number(clientId),
      );

      if (selectedTemporaryClient) {
        try {
          const { id: _temporaryId, ...clientData } = selectedTemporaryClient;
          const createdClient = await storeProjectClientRequest(getCookie('token'), clientData);
          clientId = createdClient.id;
        } catch (error) {
          toastGeneralError(error);
          setIsLoading(false);
          return;
        }
      }
    }

    const formattedData = {
      ...data,
      client_id: data.project_type === 'default' ? clientId : null,
      temporary_clients: undefined,
      terms: data.published_phase
        .concat(data.draft_phase)
        ?.map((item) => ({
          ...item,
          id: item?.item_id ?? item?.id,
          status:
            item?.status === 'book' ? 'booked' : item?.status === 'activate' ? 'actual' : 'draft',
        }))
        .filter((item) => item?.item_id ?? item?.id),
      status: 'published',
      are_public_holidays_counted: arePublicHolidaysCounted,
      internal_project_id:
        typeof data.internal_project_id === 'number'
          ? data.internal_project_id
          : data.internal_project_id?.id
          ? data.internal_project_id?.id
          : !data.project_title && data?.project?.id
          ? data.project?.id
          : null,
      draft: data.draft_phase?.filter(Boolean).length ? data.draft.toLocaleLowerCase() : null,
      project_title:
        !(data?.internal_project_id as { id: number })?.id &&
        typeof data.internal_project_id !== 'number'
          ? (data?.internal_project_id as { title: string })?.title
          : data.project_title
          ? data.project_title
          : data?.project?.title,
    };

    const draftedScope =
      data.draft?.toLocaleLowerCase() === 'unpublish scope' ||
      data?.draft?.toLocaleLowerCase() === 'archive scope';

    let response;
    if (publishedBudgetIsInEditMode) {
      response = await savePublishedBudget(getCookie('token'), projectData.id!, {
        ...(formattedData as BudgetForm),
        title: formattedData.title ? formattedData.title : 'Untitled',
        owner_id: (formattedData?.owner?.id ?? formattedData.owner_id) as string,
        edited_term_id: editPhaseId ?? null,
      });

      setPhaseStatusAfterPublish(response?.budget?.terms);
      setPublishedBudgetIsInEditMode(false);

      if (editPhaseId && !formattedData.terms.find((term) => term.id === editPhaseId)) {
        router.push(`/projects/${formattedData.internal_project_id}/plan`);
      }

      if (draftedScope) {
        router.replace(`/budget/${projectData.id!}`, undefined, { shallow: true });
        budgetForm.setValue(
          'phase',
          budgetForm.getValues('phase')?.map((phase: PhasesForm) => ({
            ...phase,
            status: 'draft' as PhasesForm['status'],
          })) ?? [],
        );
      }
    } else {
      response = await editBudget(getCookie('token'), projectData.id!, formattedData as BudgetForm);
    }

    setPublishedBudgetData({
      publishedPhases: data.sumOfPublished,
      draftPhases: data.sumOfDraft,
      isNewScope: data.draft?.toLocaleLowerCase() === 'saved as a new scope',
      isDeleted: data?.draft?.toLocaleLowerCase() === 'deleted permanently',
      newBudgetId: response.new_budget_id,
      project_id: response.internal_project_id,
      project_title: formattedData?.project_title!,
      isDrafted: draftedScope,
    });

    getBudgetingPhasesHandler();
    setSelectedProject(null);
    setProjectId(
      response.internal_project_id,
      response.budget?.project_title ?? formattedData?.project_title,
      data.draft?.toLocaleLowerCase() === 'unpublish scope'
        ? 'unpublished'
        : data.draft?.toLocaleLowerCase() === 'archive scope'
        ? 'archived'
        : 'published',
    );
    analytics.track('Budget save');

    deleteBudgetDataHandler(projectData.id!);
    setIsBookModalOpen(false);
    setIsSuccessOpen(true);
    setIsLoading(false);
  };

  const externalOnChangeOnEdit = async () => {
    try {
      let data = {
        ...bookForm.getValues(),
        terms: formattedPhaseData(bookForm.getValues('published_phase')),
        rate_card_id: bookForm.getValues('rate_card_id')!,
        update_term_status: true,
        internal_project_id:
          typeof bookForm.getValues('internal_project_id') === 'number'
            ? bookForm.getValues('internal_project_id')
            : (bookForm.getValues('internal_project_id') as { id: number })?.id
            ? (bookForm.getValues('internal_project_id') as { id: number })?.id
            : bookForm.getValues('project')?.id
            ? bookForm.getValues('project')?.id
            : null,
      };

      let response;

      response = await temporaryEditBudgetPhases(
        getCookie('token'),
        router.query.budget?.[0] ? +router.query.budget?.[0] : +getQuery('budgetId')!,
        data as {
          terms: PhasesForm[];
          rate_card_id: number;
          update_term_status: boolean;
          internal_project_id: number | null;
          are_public_holidays_counted: boolean;
        },
      );

      return response;
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const projectId = bookForm.getValues('internal_project_id') as {
    id: number | string | null;
    title: string;
  };

  const projectType = bookForm.getValues('project_type');

  const hasExistingProject = typeof projectId === 'number' || !!projectId?.id || !!selectedProject;
  const hasNewProject = !!projectId?.title;

  const isModalProjectInfoFilled =
    hasExistingProject ||
    (hasNewProject &&
      !!bookForm.getValues('project_owner') &&
      !!projectType &&
      (projectType === 'internal'
        ? !!bookForm.getValues('department_id')
        : !!bookForm.getValues('client_id')));

  const isCurrencyMisMatched =
    selectedProjectCurrency !== projectData?.currency ||
    selectedProjectCurrency !== bookForm.getValues('currency');

  const isTypeMisMatched =
    selectedProjectType !== projectData?.project_type ||
    selectedProjectType !== bookForm.getValues('project_type');

  const publishingTermsExists = bookForm.getValues('published_phase')?.length;

  const unpublishHandler = () => {
    const modalData = bookForm.getValues();
    const sumOfDraft = modalData.sumOfDraft + modalData.sumOfPublished;
    bookForm.setValue('sumOfDraft', sumOfDraft);
    bookForm.setValue('sumOfPublished', 0);
    bookForm.setValue('published_phase', []);
    const updatedPhases = modalData.published_phase.map((phase) => ({
      ...phase,
      status: 'draft' as 'draft',
    }));

    bookForm.setValue('draft_phase', [...modalData.draft_phase, ...updatedPhases]);
    bookForm.setValue('draft', 'Unpublish scope');

    const changedDraft = bookForm.getValues('draft_phase')?.map((el) => ({
      id: el.item_id,
      name: el.name,
      ready_to_book: false,
    }));

    analytics.track(`Budget unpublish`);

    storeBudgetInLocalStorage(changedDraft);
  };

  const termsArePublishedOrUnpublished =
    !!publishingTermsExists ||
    (publishedBudgetIsInEditMode && bookForm.getValues('draft') !== 'Saved as a new scope');

  const draftList = () => {
    if (publishedBudgetIsInEditMode && !bookForm.getValues('sumOfPublished')) {
      return ['Unpublish scope', 'Archive scope'];
    }

    return ['Saved as a new scope', 'Archived', 'Deleted permanently'];
  };

  const draftDropdownShouldBeHigher =
    !publishedBudgetIsInEditMode || !!bookForm.getValues('sumOfPublished');

  return {
    bookForm,
    fields,
    draftFields,
    isLoading,
    setIsLoading,
    changeBudgetStatus,
    deleteBudgetDataHandler,
    submitData,
    isModalProjectInfoFilled,
    selectedProjectCurrency,
    setSelectedProjectCurrency,
    setSelectedProjectType,
    isCurrencyMisMatched,
    publishingTermsExists,
    externalOnChangeOnEdit,
    selectedProject,
    setSelectedProject,
    unpublishHandler,
    termsArePublishedOrUnpublished,
    draftList,
    draftDropdownShouldBeHigher,
    isTypeMisMatched,
    projectType,
  };
};
