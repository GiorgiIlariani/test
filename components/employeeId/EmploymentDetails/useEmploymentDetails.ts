'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { can, canUpdateLogInfo, toastGeneralError } from 'helpers';
import { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { editEmployee } from 'services';
import { ShowPageEmployee } from 'types';
import { EmploymentDetailsFormValues, employmentDetailsSchema } from './employmentDetailsSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEmploymentDetails = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
) => {
  const { user, positions, seniorities, departments, applicationConfigs } =
    useContext(GlobalApiInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const defaultValues = useMemo<EmploymentDetailsFormValues>(
    () => ({
      join_date: employee.join_date,
      position_id: employee.position.id ?? null,
      seniority_id: employee.seniority.id ?? null,
      department_id: employee.department?.id ?? null,
      salary: employee.salary?.salary ?? null,
      salary_currency: employee.salary?.currency ?? 'USD',
      email: employee.email,
      job_type: employee.job_type,
      availability: employee.availability,
    }),
    [employee],
  );

  const form = useForm<EmploymentDetailsFormValues>({
    resolver: zodResolver(employmentDetailsSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const onSubmit = async (data: EmploymentDetailsFormValues) => {
    try {
      setIsLoading(true);

      await editEmployee(employee.id, getCookie('token'), data);

      setModalOpen(false);
      refetchEmployeeData();
    } catch (e: any) {
      if (e?.message.includes('frontValidation')) return;

      if (!('response' in e)) return toastGeneralError(e);

      if (e?.response?.data?.message.includes('email')) {
        form.setError('email', {
          type: 'custom',
          message: 'User with this email already exists',
        });
      } else {
        toastGeneralError(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const jobType = form.watch('job_type');
  const isPreOffer = jobType === 'pre-offer';
  const canNotEdit = !can('employment-details:crud', user?.permissions);
  const canEditLogInfo = !!canUpdateLogInfo(jobType ?? '', user.permissions);
  const canViewSalary = !!can('employee::salary-view', user?.permissions);

  const setModalOpen = (open: boolean) => {
    form.reset(defaultValues);
    setIsModalOpen(open);
  };

  return {
    form,
    onSubmit,

    setModalOpen,
    isModalOpen,

    canNotEdit,
    canViewSalary,
    canEditLogInfo,

    isPreOffer,

    positions,
    seniorities,
    departments,
    applicationConfigs,

    loading,
  };
};
