'use client';

import { getCookie } from 'cookies-next';
import { currentReviewer, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { approveVacation, rejectVacation } from 'services';
import { SetState, VacationsArray, VacationsReview } from 'types';
import { Props } from './types';

export const useVacationApprovalActions = (
  setReviewing: SetState<boolean>,
  setCanNotEdit: SetState<boolean>,
  currentVacationInfo: Props['currentVacationInfo'],
  currentVacation: Props['currentVacation'],
  setModalType: Props['setModalType'],
  setVacationData: Props['setVacationData'],
  userId: Props['userId'],
  submitHandler: Props['submitHandler'],
  setVacations: Props['setVacations'],
) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [approveIsLoading, setApproveIsLoading] = useState(false);
  const [rejectedIsLoading, setRejectedIsLoading] = useState(false);

  const form = useFormContext<VacationsReview>();

  const approveVacations = async () => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.trigger();
    } else {
      setApproveIsLoading(true);
      try {
        await approveVacation(currentVacation.id as number, getCookie('token'));
        setApproveIsLoading(false);
        setVacationData((prev) => {
          const newDate = [...prev];
          const currentVacation = newDate[currentVacationInfo.currentIndex];

          const reviewer = currentVacation.reviewers.find((reviewer) => reviewer.id === userId);
          if (reviewer) {
            reviewer.status = 'approved';
            reviewer.status_changed_at = new Date().toISOString();
          }

          const allApproved = currentVacation.reviewers.every(
            (reviewer) => reviewer.status === 'approved',
          );

          currentVacation.status = allApproved ? 'approved' : 'pending';

          return newDate;
        });

        setVacations((prev) => {
          const newDate = [...prev];

          newDate.map((employee) => {
            return employee.id === currentVacation.employee_id
              ? {
                  ...employee,
                  vacations: employee.vacations.map((vacation) => {
                    if (vacation.id === currentVacation.id) {
                      const reviewer = vacation.reviewers.find(
                        (reviewer) => reviewer.id === userId,
                      );
                      if (reviewer) {
                        reviewer.status = 'approved';
                        reviewer.status_changed_at = new Date().toISOString();
                      }

                      const allApproved = vacation.reviewers.every(
                        (reviewer) => reviewer.status === 'approved',
                      );

                      vacation.status = allApproved ? 'approved' : 'pending';

                      return vacation;
                    } else {
                      return vacation;
                    }
                  }),
                }
              : employee;
          });

          return newDate;
        });
        setReviewing(false);
        setCanNotEdit(true);
        submitHandler(form.getValues());
        setModalType(
          currentVacation.reviewers.length === 0
            ? 'approved'
            : currentVacation.reviewers.every((reviewer) => reviewer.status === 'approved')
            ? 'approved'
            : 'pending',
        );
      } catch (error: any) {
        toastGeneralError(error);
      } finally {
        setIsApproved(true);
        setIsRejected(false);
      }
    }
  };

  const rejectVacations = async () => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.trigger();
    } else {
      setRejectedIsLoading(true);
      try {
        await rejectVacation(currentVacation.id as number, getCookie('token'));
        setRejectedIsLoading(false);
        setVacationData((prev) => {
          const newDate = [...prev];
          const currentVacation = newDate[currentVacationInfo.currentIndex];
          const reviewer = currentVacation.reviewers.find((reviewer) => reviewer.id === userId);
          if (reviewer) {
            reviewer.status = 'rejected';
            reviewer.status_changed_at = new Date().toISOString();
          }

          currentVacation.status = 'rejected';

          return newDate;
        });
        setVacations((prev) => {
          const newDate = [...prev];

          newDate.map((employee) => {
            return employee.id === currentVacation.employee_id
              ? {
                  ...employee,
                  vacations: employee.vacations.map((vacation) => {
                    if (vacation.id === currentVacation.id) {
                      const reviewer = vacation.reviewers.find(
                        (reviewer) => reviewer.id === userId,
                      );
                      if (reviewer) {
                        reviewer.status = 'rejected';
                        reviewer.status_changed_at = new Date().toISOString();
                      }

                      vacation.status = 'rejected';

                      return vacation;
                    } else {
                      return vacation;
                    }
                  }),
                }
              : employee;
          });

          return newDate;
        });
        setReviewing(false);
        setCanNotEdit(true);
        submitHandler(form.getValues());
        setModalType('rejected');
      } catch (error: any) {
        toastGeneralError(error);
      } finally {
        setIsRejected(true);
        setIsApproved(false);
      }
    }
  };

  const disableApproveRejectStaticState = (
    userId: number,
    reviewers: VacationsArray['reviewers'],
  ) => {
    const currentReviewer = reviewers?.find((reviewer) => reviewer.id === userId);
    currentReviewer?.status !== 'rejected' && setIsRejected(false);
    currentReviewer?.status !== 'approved' && setIsApproved(false);
  };

  const currentReviewerStatus = currentReviewer(userId, currentVacation)?.status;

  return {
    approveVacations,
    rejectVacations,
    disableApproveRejectStaticState,
    isApproved,
    isRejected,
    approveIsLoading,
    rejectedIsLoading,
    currentReviewerStatus,
  };
};
