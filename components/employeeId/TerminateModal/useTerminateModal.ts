'use client';

import { getCookie } from 'cookies-next';
import {
  analytics,
  handleBackendErrors,
  reconcileDate,
  standardizeDate,
  toastGeneralError,
} from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { getUsersCurrentAndFutureProjects, postCareerHistory } from 'services';
import { ActionForm, EmployeeFormFieldDefaults, SetState, UserProject } from 'types';

const getCompensationTillDate = (date: string) => {
  const lastDay = reconcileDate(date);
  const compensationTillDate = new Date(lastDay.setMonth(lastDay.getMonth() + 2));
  return standardizeDate(compensationTillDate);
};

export const useTerminateModal = (
  toggleModal: () => void,
  userId: number,
  setActionsAreAdded: SetState<boolean>,
  setCanNotTerminate: SetState<boolean>,
  setUserProjectsInfo: SetState<UserProject[]>,
  refetchEmployees?: () => void | undefined,
  defaultDate?: string,
  isInBudgetView?: boolean,
) => {
  const [compensationTill, setCompensationTill] = useState(false);
  const [compensationEnabled, setCompensationEnabled] = useState(false);

  const initialCompensationTillDate = defaultDate ? getCompensationTillDate(defaultDate) : null;

  const { setValue } = useFormContext<EmployeeFormFieldDefaults>();
  const form = useForm<ActionForm>({
    defaultValues: {
      date: defaultDate ?? '',
      status: isInBudgetView ? 'draft' : 'active',
      meta: {
        voluntarity: '',
        reason: '',
        would_rehire: undefined,
        compensation_enabled: false,
        compensation_till: initialCompensationTillDate,
      },
      type: ['Termination'],
      user_id: userId,
    },
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (data: Partial<ActionForm>) => {
    setLoading(true);
    try {
      const dataCopy = { ...data };
      dataCopy.meta!.would_rehire = dataCopy.meta?.would_rehire === 'yes';
      const userProjects = await getUsersCurrentAndFutureProjects(
        getCookie('token'),
        data.user_id!,
        data.date as string,
      );
      const employeeIsInActiveTerms = userProjects.length;
      if (employeeIsInActiveTerms) {
        setCanNotTerminate(true);
        setUserProjectsInfo(userProjects);
      } else {
        setCanNotTerminate(false);
        await postCareerHistory(getCookie('token'), dataCopy);
        setValue('leave_date', dataCopy.date!);
        setActionsAreAdded((prev) => !prev);
        analytics.track('Employee Terminated');
        toggleModal();
        refetchEmployees?.();
      }
    } catch (error: any) {
      if (error?.response?.status === 422) {
        handleBackendErrors(error?.response?.data.errors, form.setFocus, form.setError);
        error.response.data.message === "Career history can't be created" &&
          toastGeneralError(
            error,
            null,
            'Delete previous one and add another termination again',
            'Termination already exists',
            'general_error',
            true,
          );
      } else {
        toastGeneralError(error, router);
      }
    } finally {
      setLoading(false);
    }
  };

  const [voluntarity, last_working_day] = useWatch({
    control: form.control,
    name: ['meta.voluntarity', 'date'],
  });
  const isTerminationNotVoluntary = voluntarity === 'involuntarily';

  const setCompensationTillDate = (lastWorkDay: string) => {
    form.setValue('meta.compensation_till', getCompensationTillDate(lastWorkDay));
  };

  return {
    form,
    handleSubmit,
    loading,
    voluntarity,
    last_working_day,
    isTerminationNotVoluntary,
    setCompensationTillDate,
    compensationEnabled,
    compensationTill,
    setCompensationTill,
    setCompensationEnabled,
  };
};
