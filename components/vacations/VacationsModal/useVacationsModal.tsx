'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Department,
  Permission,
  SetState,
  VacationsArray,
  VacationsReview,
  VacationStatus,
} from 'types';
import {
  deleteVacationRequest,
  deleteVacationReviewRequest,
  getUsersFromSameDepartment,
  postReviewerFields,
  updateVacation,
} from 'services';
import { getCookie } from 'cookies-next';
import {
  getWorkingDays,
  toastGeneralError,
  currentReviewer,
  generateAvatarSrc,
  canUserSeeAdditionalVacationFields,
  can,
  handleBackendErrors,
} from 'helpers';
import {
  canUserReviewDelete,
  canUserReviewVacation,
  canVacationBeDeleteWithoutReview,
  doesVacationHaveFinalReviewer,
  getDefaultCanNotEditValue,
  getDefaultReviewingValue,
  getVacationModalDefaultData,
  isUserReviewer,
} from './helpers';
import { Props } from './types';
import { GlobalApiInfo } from 'context';

export const useVacationsModal = (
  modalData: VacationsArray | undefined,
  setVacationData: SetState<VacationsArray[]>,
  currentVacationInfo: { sum: number; currentIndex: number },
  userId: number,
  modalType: VacationStatus,
  closeModal: (latestVacationData?: VacationsArray[]) => void,
  currentEmployee:
    | {
        id: number;
        first_name: string;
        last_name: string;
        avatar: string;
        department: Department;
      }
    | undefined,
  setModalType: Props['setModalType'],
  permissions: Permission[],
  setVacations: Props['setVacations'],
) => {
  const [canNotEditAdditional, setCanNotEditAdditional] = useState(
    getDefaultCanNotEditValue(
      canUserReviewVacation(userId, modalData, modalType),
      currentVacationInfo.sum > 1,
      modalType,
      modalData && modalData.delete_requested ? 1 : 0,
    ),
  );
  const [canNotEditMain, setCanNotEditMain] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const { user, publicHolidays } = useContext(GlobalApiInfo);

  const [deleting, setDeleting] = useState(false);
  const [deleteIsLoading, setDeleteInsLoading] = useState(false);
  const [usersFromSameDepartment, setUsersFromSameDepartment] = useState<
    { id: number; avatar: string; title: string }[]
  >([]);
  const [isReplacedFieldIsLoading, setIsReplacedFieldIsLoading] = useState(true);
  const [deleteReviewIsLoading, setDeleteReviewIsLoading] = useState(false);
  const [approvingDelete, setApprovingDelete] = useState(false);
  const [rejectingDelete, setRejectingDelete] = useState(false);
  const [editingIsLoading, setEditingIsLoading] = useState(false);
  const holidayDates = publicHolidays.holidays.map((h) => h.date);

  const form = useForm<VacationsReview>({
    mode: 'onSubmit',
    defaultValues: useMemo(
      () => getVacationModalDefaultData(modalData, holidayDates) as VacationsReview,
      [modalData],
    ),
  });

  const projects = useWatch({
    control: form.control,
    name: 'internal_projects',
  });

  const getProjectExcludedStatus = (i: number) => {
    return projects?.[i].is_excluded?.toLowerCase();
  };

  useEffect(() => {
    modalData && setModalType(modalData.status);
    setReviewing(
      getDefaultReviewingValue(
        canUserReviewVacation(userId, modalData, modalType),
        currentVacationInfo.sum > 1,
        modalType,
        modalData && modalData.delete_requested ? 1 : 0,
      ),
    );

    if (
      currentReviewer(userId, modalData)?.status === 'approved' ||
      currentReviewer(userId, modalData)?.status === 'rejected'
    ) {
      setReviewing(false);
      setCanNotEditAdditional(true);
    }
    form.reset(getVacationModalDefaultData(modalData, holidayDates));
  }, [currentVacationInfo, form, modalData]);

  const cancelEditingHandler = () => {
    form.reset(getVacationModalDefaultData(modalData, holidayDates));
    setCanNotEditMain(true);
  };

  const getUsersFromSameDepartmentHandler = async () => {
    try {
      const response = await getUsersFromSameDepartment(currentEmployee?.id!, getCookie('token'));
      const formattedData = response.data?.map(
        (employee: { id: number; name: string; avatar: string }) => ({
          id: employee.id,
          avatar:
            employee.avatar ??
            generateAvatarSrc(employee.name.split(' ')[0], employee.name.split(' ')[1]),
          title: employee.name,
        }),
      );
      setUsersFromSameDepartment([{ id: null, title: 'No replacement' }, ...formattedData]);
      setIsReplacedFieldIsLoading(false);
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    getUsersFromSameDepartmentHandler();
  }, [currentEmployee?.id]);

  const cancelDeleting = () => setDeleting(false);

  const startDeleting = () => setDeleting(true);

  const handleDelete = async () => {
    setDeleteInsLoading(true);
    try {
      await deleteVacationRequest(modalData?.id as number, getCookie('token'));

      const canDelete = canVacationBeDeleteWithoutReview(modalData?.reviewers ?? []);

      reflectVacationsDeleteInAllVacations(canDelete, false);

      if (canDelete) {
        setVacationData((prev) => {
          const newDate = [...prev];
          newDate.splice(currentVacationInfo.currentIndex, 1);
          closeModal(newDate);
          return newDate;
        });
      }
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setDeleteInsLoading(false);
      cancelDeleting();
    }
  };

  const submitHandler = async (data: VacationsReview) => {
    setEditingIsLoading(true);

    const formattedProjects = data.internal_projects.map((project) => ({
      ...project,
      is_excluded: project.is_excluded.toLowerCase(),
      fallback_employee_id: isNaN(project.fallback_employee as number)
        ? null
        : project.fallback_employee,
    }));
    try {
      let vacationResponse: VacationsArray;
      if (!canNotEditMain) {
        const formData = new FormData();
        formData.append('start_date', data.start_date);
        formData.append('end_date', data.end_date);
        formData.append('comment', data.comment);
        data.sick_notes.map((file) => {
          formData.append('sick_notes[]', file as File, file.name);
        });
        const reviewerIds = data.reviewers.map((r) => r.id);

        reviewerIds.forEach((id, index) => {
          formData.append(`reviewers[${index}]`, JSON.stringify(id));
        });

        vacationResponse = await updateVacation(
          modalData?.id as number,
          formData,
          getCookie('token'),
        );

        const isUserOwner = vacationResponse.employee?.id == userId;

        setVacationData((vacations) => {
          return vacations.map((vacation) =>
            vacation.id === modalData?.id
              ? {
                  ...vacation,
                  status: isUserOwner ? 'pending' : vacation.status,
                  number_of_vacation_days_in_month:
                    vacationResponse.number_of_vacation_days_in_month,
                  start_date: vacationResponse.start_date,
                  end_date: vacationResponse.end_date,
                  sick_notes: vacationResponse.sick_notes,
                  comment: vacationResponse.comment,
                  reviewers: vacationResponse.reviewers.map((reviewer) => ({
                    ...reviewer,
                    status: isUserOwner ? 'pending' : reviewer.status,
                  })),
                  internal_projects: vacationResponse.internal_projects,
                }
              : vacation,
          );
        });

        setVacations((prev) => {
          return prev.map((employee) =>
            employee.id === modalData?.employee_id
              ? {
                  ...employee,
                  vacations: employee.vacations.map((vacation) =>
                    vacation.id === modalData.id
                      ? {
                          ...vacation,
                          status: isUserOwner ? 'pending' : vacation.status,
                          number_of_vacation_days_in_month:
                            vacationResponse.number_of_vacation_days_in_month,
                          start_date: vacationResponse.start_date,
                          end_date: vacationResponse.end_date,
                          sick_notes: vacationResponse.sick_notes,
                          comment: vacationResponse.comment,
                          reviewers: vacationResponse.reviewers.map((reviewer) => ({
                            ...reviewer,
                            status: isUserOwner ? 'pending' : reviewer.status,
                          })),
                          internal_projects: vacationResponse.internal_projects,
                        }
                      : vacation,
                  ),
                }
              : employee,
          );
        });
      }

      if (
        !canNotEditAdditional &&
        (can('vacation::update-all', permissions) || isUserReviewer(userId, modalData))
      ) {
        vacationResponse = await postReviewerFields(
          modalData?.id as number,
          { ...data, internal_projects: formattedProjects },
          getCookie('token'),
        );

        setVacationData((vacations) =>
          vacations.map((vacation) =>
            vacation.id === modalData?.id
              ? {
                  ...vacation,
                  internal_projects: vacationResponse.internal_projects,
                }
              : vacation,
          ),
        );

        setVacations((prev) => {
          return prev.map((employee) =>
            employee.id === modalData?.employee_id
              ? {
                  ...employee,
                  vacations: employee.vacations.map((vacation) =>
                    vacation.id === modalData.id
                      ? {
                          ...vacation,
                          internal_projects: vacationResponse.internal_projects,
                        }
                      : vacation,
                  ),
                }
              : employee,
          );
        });
      }

      setCanNotEditAdditional(true);
      setCanNotEditMain(true);
    } catch (error: any) {
      if (error?.response?.status === 422) {
        handleBackendErrors(error?.response?.data.errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error);
      }
    } finally {
      setEditingIsLoading(false);
    }
  };

  const handleDeleteReview = (rejected: boolean) => {
    if (rejected) {
      reviewDelete(rejected);
    } else {
      setApprovingDelete(true);
    }
  };

  const cancelApprovingDelete = () => {
    setApprovingDelete(false);
  };

  const reviewDelete = async (rejected: boolean) => {
    if (rejected) {
      setRejectingDelete(true);
    } else {
      setDeleteReviewIsLoading(true);
    }
    try {
      await deleteVacationReviewRequest(modalData?.id as number, getCookie('token'), {
        review: rejected ? 'rejected' : 'approved',
      });
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setRejectingDelete(false);
      setApprovingDelete(false);
      setDeleteReviewIsLoading(false);
      reflectVacationsDeleteInAllVacations(!rejected, true);
    }
  };

  const resetReviewingAndCanNotEdit = (newVacation: VacationsArray) => {
    const userCanReviewVacation = canUserReviewVacation(userId, newVacation, newVacation.status);
    setCanNotEditAdditional(
      getDefaultCanNotEditValue(
        userCanReviewVacation,
        true,
        newVacation.status,
        newVacation.delete_requested,
      ),
    );
    setCanNotEditMain(true);
    setReviewing(
      getDefaultReviewingValue(
        userCanReviewVacation,
        true,
        newVacation.status,
        newVacation.delete_requested,
      ),
    );
  };

  const requestType = modalData?.type ?? 'vacation';

  const userCanReviewDelete = canUserReviewDelete(userId, modalData?.reviewers ?? []);

  const vacationRequestDaysCount = getWorkingDays(
    new Date(form.getValues('start_date')),
    new Date(form.getValues('end_date')),
    holidayDates,
  );

  const isEmployeeInBench = form.getValues('internal_projects')?.length === 0;

  const vacationHasFinalReviewer = doesVacationHaveFinalReviewer(modalData?.reviewers ?? []);

  const lastReviewIndex = modalData ? modalData.reviewers.length - 1 : 0;
  let shouldActionsBeShown = currentEmployee?.id !== userId && isUserReviewer(userId, modalData);

  shouldActionsBeShown =
    shouldActionsBeShown ||
    (modalData?.employee?.id === userId && !!can('vacation::update-all', permissions));

  const userCanSeeVacationFields = canUserSeeAdditionalVacationFields(
    permissions,
    currentEmployee?.department as Department,
  );

  const errorModalMessage = `Are you sure you want to delete a ${requestType}? ${
    !canVacationBeDeleteWithoutReview(modalData?.reviewers ?? [])
      ? `If you want to delete requested ${requestType} your request must be approved by ${
          vacationHasFinalReviewer
            ? `${modalData?.reviewers[lastReviewIndex].first_name} ${modalData?.reviewers[lastReviewIndex].last_name}`
            : `${modalData?.reviewers
                ?.map((el) => `${el.first_name} ${el.last_name}`)
                .join(' or ')}`
        }`
      : ''
  }`;

  const reflectVacationsDeleteInAllVacations = (isDeleted: boolean, isReview: boolean) => {
    if (isDeleted) {
      setVacations((prev) => {
        return prev.map((employee) =>
          employee.id === modalData?.employee_id
            ? {
                ...employee,
                vacations: employee.vacations.filter((vacation) => vacation.id !== modalData.id),
              }
            : employee,
        );
      });
      setVacationData((prev) => {
        const newDate = [...prev];
        newDate.splice(currentVacationInfo.currentIndex, 1);
        closeModal(newDate);
        return newDate;
      });
    } else {
      setVacations((prev) => {
        return prev.map((employee) =>
          employee.id === modalData?.employee_id
            ? {
                ...employee,
                vacations: employee.vacations.map((vacation) =>
                  vacation.id === modalData.id
                    ? {
                        ...vacation,
                        delete_requested: 1,
                      }
                    : vacation,
                ),
              }
            : employee,
        );
      });

      setVacationData((prev) => {
        const newDate = [...prev];
        newDate[currentVacationInfo.currentIndex].delete_requested = isReview ? 0 : 1;

        return newDate;
      });
    }
  };

  return {
    form,
    submitHandler,
    deleting,
    cancelDeleting,
    startDeleting,
    handleDelete,
    deleteIsLoading,
    reviewing,
    canNotEditAdditional,
    setCanNotEditAdditional,
    setReviewing,
    usersFromSameDepartment,
    isReplacedFieldIsLoading,
    deleteReviewIsLoading,
    handleDeleteReview,
    approvingDelete,
    reviewDelete,
    cancelApprovingDelete,
    resetReviewingAndCanNotEdit,
    requestType,
    userCanReviewDelete,
    cancelEditingHandler,
    rejectingDelete,
    user,
    editingIsLoading,
    projects,
    getProjectExcludedStatus,
    vacationRequestDaysCount,
    isEmployeeInBench,
    vacationHasFinalReviewer,
    lastReviewIndex,
    shouldActionsBeShown,
    userCanSeeVacationFields,
    errorModalMessage,
    holidayDates,
    canNotEditMain,
    setCanNotEditMain,
    modalData,
  };
};
