'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import {
  handleBackendErrors,
  toastGeneralError,
  formatDate,
  getWorkingDays,
  EmployeeModel,
} from 'helpers';
import { useContext, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { getDefaultReviewers, getVacationPeriodsForUser, postVacationsRequest } from 'services';
import { Recruiter, VacationForm } from 'types';
import { Props } from './types';

export const useVacationRequestModal = (
  toggleModal: () => void,
  reviewers: Recruiter[],
  updateVacations: () => void,
  adding: Props['adding'],
  vacations: Props['vacations'],
) => {
  const form = useForm<VacationForm>({
    mode: 'onSubmit',
    defaultValues: {
      type: 'vacation',
      reviewers: [],
      comment: '',
      end_date: '',
      start_date: '',
      sick_notes: [],
    },
    shouldUnregister: false,
  });
  const { user, publicHolidays } = useContext(GlobalApiInfo);

  const [startDate, endDate, type] = useWatch({
    control: form.control,
    name: ['start_date', 'end_date', 'type'],
  });

  const [areVacationDaysOverTheLimit, setAreVacationDaysOverTheLimit] = useState(false);
  const [vacationExceededDays, setVacationExceededDays] = useState(0);

  const currentEmployee = new EmployeeModel(vacations.find((vacation) => user.id === vacation.id)!);
  const [loading, setLoading] = useState(false);

  const { errors } = form.formState;

  useEffect(() => {
    if (typeof adding === 'object') {
      const startDate = new Date(adding.year, adding.month - 1, 1);
      const endDate = new Date(adding.year, adding.month, 0);
      const formattedStartDate = formatDate(startDate)?.split('.').reverse().join('-');

      const formattedEndDate = formatDate(endDate)?.split('.').reverse().join('-');
      form.setValue('end_date', formattedEndDate);
      form.setValue('start_date', formattedStartDate);
    }
  }, [adding]);

  const datesChangeHandler = async () => {
    const startDate = form.getValues('start_date');
    const endDate = form.getValues('end_date');
    if (startDate && endDate) {
      try {
        const [data, vacationPeriods] = await Promise.all([
          getDefaultReviewers(getCookie('token'), user.id, startDate, endDate),
          getVacationPeriodsForUser(getCookie('token'), user.id, new Date(startDate).getFullYear()),
        ]);
        currentEmployee.setEmployeeVacationPeriods(vacationPeriods);
        const newReviewers: VacationForm['reviewers'] = [];
        data?.map((reviewer) => {
          const foundReviewer = reviewers.find((el) => el.id === reviewer.id);
          if (foundReviewer) {
            newReviewers.push({
              ...foundReviewer,
              required: reviewer.required,
            });
          }
        });
        form.reset({
          ...form.getValues(),
          reviewers: newReviewers,
        });
      } catch (error: any) {
        if (error?.response?.status === 422) {
          handleBackendErrors(error?.response?.data.errors, form.setFocus, form.setError);
        } else {
          toastGeneralError(error);
        }
      }
    }
  };

  const holidayDates = publicHolidays.holidays.map((h) => h.date);

  const submitHandler = async (data: VacationForm, isFromExceedModal: boolean = false) => {
    if (!isFromExceedModal && data.type === 'vacation') {
      const workingDays = getWorkingDays(new Date(startDate), new Date(endDate), holidayDates);
      let daysLeft = 0;
      if (currentEmployee.isBonusExpired() || !currentEmployee.isBonusPeriod()) {
        daysLeft = currentEmployee.numberOfVacationDaysLeft() - workingDays;
      } else {
        daysLeft = currentEmployee.numberOfBonusDaysLet() - workingDays;
      }

      if (daysLeft < 0) {
        setVacationExceededDays(Math.abs(daysLeft));
        setAreVacationDaysOverTheLimit(true);
        return;
      }
    }

    setLoading(true);
    const formData = new FormData();
    const filteredReviewers = data.reviewers.filter((el) => el.name);
    const reviewers = filteredReviewers.map((el) => el.id);
    formData.append('type', data.type);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('comment', data.comment);
    formData.append('reviewers', JSON.stringify(reviewers));

    data.sick_notes.map((file) => {
      formData.append('sick_notes[]', file, file.name);
    });
    form.setValue('reviewers', filteredReviewers);
    try {
      await postVacationsRequest(getCookie('token'), formData);
      toggleModal();
      updateVacations();
    } catch (error: any) {
      if (error?.response?.status === 422) {
        setAreVacationDaysOverTheLimit(false);
        handleBackendErrors(error?.response?.data.errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    type,
    holidayDates,
    submitHandler,
    datesChangeHandler,
    currentEmployee,
    areVacationDaysOverTheLimit,
    setAreVacationDaysOverTheLimit,
    vacationExceededDays,
  };
};
