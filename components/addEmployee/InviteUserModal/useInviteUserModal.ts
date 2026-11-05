'use client';
import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { analytics, handleBackendErrors, roundNumberToDecimals, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { submitEmployeeRequest } from 'services';
import { AddNewUser } from 'types';

export const useInviteUserModal = (
  setInviteUserModalIsOpen: (isOpen: boolean) => void,
  getUsers: () => void,
) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { positions, seniorities, departments, applicationConfigs } = useContext(GlobalApiInfo);

  const defaultCurrency = applicationConfigs.currency.currency;
  const grossToNetMultiplier = applicationConfigs.gross_to_net_multiplier;

  const form = useForm<AddNewUser>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: '',
      join_date: '',
      position_id: '',
      department_id: '',
      availability: 'Full-time',
      job_type: '',
      seniority_id: '',
      salary: '',
      net_salary: '',
      salary_currency: defaultCurrency || 'GEL',
      payment_type: 'monthly',
    },
    mode: 'onSubmit',
  });

  const handleGrossSalaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      form.setValue('net_salary', '', { shouldDirty: true, shouldValidate: true });
      return;
    }

    const calculatedValue = roundNumberToDecimals(
      Number(event.target.value) * Number(grossToNetMultiplier),
      2,
    );

    form.setValue('net_salary', calculatedValue, { shouldDirty: true, shouldValidate: true });
  };

  const handleNetSalaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      form.setValue('salary', '', { shouldDirty: true, shouldValidate: true });
      return;
    }

    const multiplier = Number(grossToNetMultiplier);
    const calculatedValue =
      multiplier === 0
        ? ''
        : roundNumberToDecimals(Number(event.target.value) / multiplier, 2) ?? '';

    form.setValue('salary', calculatedValue, { shouldDirty: true, shouldValidate: true });
  };

  const trackSegment = (data: AddNewUser) => {
    data.first_name && analytics.track('Invite user - First name');
    data.last_name && analytics.track('Invite user - Last name');
    data.email && analytics.track('Invite user - Email');
    data.role && analytics.track('Invite user - Role');
    data.join_date && analytics.track('Invite user - Join date');
    data.position_id && analytics.track('Invite user - Position');
    data.department_id && analytics.track('Invite user - Department');
    data.availability && analytics.track('Invite user - Availability');
    data.job_type && analytics.track('Invite user - Employee type');
    data.seniority_id && analytics.track('Invite user - Seniority');
    data.salary && analytics.track('Invite user - Salary');
  };

  const onSubmit = async (data: AddNewUser) => {
    analytics.track('Invite user - Send request');
    setIsSubmitting(true);

    try {
      const dataCopy = { ...data };
      delete dataCopy.net_salary;

      await submitEmployeeRequest(dataCopy, getCookie('token'));

      getUsers();
      setIsSubmitting(false);
      setInviteUserModalIsOpen(false);

      trackSegment(dataCopy);
    } catch (error: any) {
      const errors = error?.response?.data?.errors;

      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error, router);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    positions,
    seniorities,
    departments,
    isSubmitting,
    handleGrossSalaryChange,
    handleNetSalaryChange,
  };
};
