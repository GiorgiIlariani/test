'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { analytics, handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { postCareerHistory } from 'services';
import { ActionForm, EmployeeFormFieldDefaults, SetState, ShowPageEmployee } from 'types';

export const useCarerChange = (
  toggleModal: () => void,
  userId: number,
  setActionsAreAdded: SetState<boolean>,
  employee: ShowPageEmployee,
  refetchEmployees?: () => void | undefined,
  defaultDate?: string,
  isInBudgetView?: boolean,
) => {
  const { setValue, getValues } = useFormContext<EmployeeFormFieldDefaults>();
  const [informationStepIsOpen, setInformationStepIsOpen] = useState(false);
  const { seniorities, positions, departments, applicationConfigs } = useContext(GlobalApiInfo);
  const [loading, setLoading] = useState(false);
  const form = useForm<ActionForm>({
    mode: 'onSubmit',
    defaultValues: {
      type: [],
      date: defaultDate ?? '',
      status: isInBudgetView ? 'draft' : 'active',
      meta: {
        would_rehire: undefined,
      },
      user_id: userId,
      salary: undefined,
      payment_type: employee.salary?.payment_type ?? 'monthly',
      currency: employee.salary?.currency ?? 'USD',
      position_id: undefined,
      seniority_id: undefined,
      department_id: undefined,
      salary_change_reason: '',
      availability: employee.availability,
      job_type: employee.job_type,
    },
  });
  const { defaultValues } = form.formState;
  const router = useRouter();

  const defaultCurrency = applicationConfigs.currency.currency;
  const grossToNetMultiplier = applicationConfigs.gross_to_net_multiplier;

  const types: string[] = useWatch({
    control: form.control,
    name: 'type',
  });

  const handlePreviousStep = () => {
    analytics.track('Employee Career Change - Previous button');
    if (informationStepIsOpen) {
      form.reset(defaultValues);
      setInformationStepIsOpen(false);
    } else {
      toggleModal();
    }
  };

  const nextStepHandler = async (data?: Partial<ActionForm>) => {
    if (informationStepIsOpen && data) {
      setLoading(true);

      const dataCopy = data;
      delete dataCopy.net_salary;

      if (dataCopy.meta?.initiative === 'other') {
        dataCopy.meta.initiative = dataCopy.salary_change_reason ?? '';
        delete dataCopy.salary_change_reason;
      }
      if (!dataCopy.type?.includes('Salary')) {
        delete dataCopy.salary;
        dataCopy.currency && delete dataCopy.currency;
      }
      try {
        await postCareerHistory(getCookie('token'), dataCopy);
        const date = new Date(data.date!);
        const currentSalaryStartDate = new Date(getValues('salary_start_date')?.toString() ?? '');
        date.setHours(0);
        currentSalaryStartDate.setHours(0);
        if (date >= currentSalaryStartDate && dataCopy.type?.includes('Salary')) {
          setValue('salary.salary', data.salary!);
          setValue('salary.currency', data.currency ?? 'USD');
        }
        if (dataCopy.type?.includes('Seniority')) {
          setValue('seniority_id', data.seniority_id!);
        }
        if (dataCopy.type?.includes('Department')) {
          setValue('department_id', data.department_id!);
        }
        if (dataCopy.type?.includes('Position')) {
          setValue('position_id', data.position_id!);
        }
        if (router.query.tab?.includes('career-history')) {
          setActionsAreAdded((prev) => !prev);
        }

        dataCopy?.department_id && analytics.track('Career Change - Department');
        dataCopy?.seniority_id && analytics.track('Career Change - Seniority');
        dataCopy?.salary && analytics.track('Career Change - Salary');
        dataCopy?.position_id && analytics.track('Career Change - Position');

        refetchEmployees?.();
        toggleModal();
        form.reset(defaultValues);
      } catch (error: any) {
        if (error?.response?.status === 422) {
          handleBackendErrors(error?.response?.data.errors, form.setFocus, form.setError);
        } else {
          toastGeneralError(error, router);
        }
      } finally {
        setLoading(false);
      }
    }
    setInformationStepIsOpen(true);
  };

  return {
    nextStepHandler,
    informationStepIsOpen,
    form,
    types,
    seniorities,
    positions,
    departments,
    handlePreviousStep,
    loading,
    defaultCurrency,
    grossToNetMultiplier,
  };
};
