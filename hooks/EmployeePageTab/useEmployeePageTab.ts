'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CareerHistory, historyCv, ShowPageEmployee, Skill } from 'types';
import { getEmployeeCvHistory, getEmployeeRequest, getUserCareerHistory } from 'services';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { GlobalApiInfo } from 'context';

export const useEmployeePageTab = (
  employeeData: ShowPageEmployee,
  propSkills: Skill[],
  cvHistory: historyCv[],
) => {
  const [canNotEdit, setCanNotEdit] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [allowLeave, setAllowLeave] = useState<boolean | undefined | string>();
  const [tryingToLeave, setTryingToLeave] = useState<boolean | string>(false);
  const [cvHistoryState, setCvHistoryState] = useState(cvHistory);
  const [dataIsSaved, setDataIsSaved] = useState<boolean>(false);
  const [actionsAreAdded, setActionsAreAdded] = useState(false);
  const [forceReloadSkills, setForceReloadSkills] = useState(false);
  const [addProfileInfoIsOpen, setAddProfileInfoIsOpen] = useState(false);
  const [employee, setEmployee] = useState<ShowPageEmployee>(employeeData);
  const [isLoading, setIsLoading] = useState(true);
  const [careerLog, setCareerLog] = useState<CareerHistory[]>([]);

  const router = useRouter();

  useEffect(() => {
    getCareerHistory();
    employeeData && setIsLoading(false);
  }, [employeeData]);

  const form = useForm({
    defaultValues: useMemo(() => {
      const defaults = employee;
      return defaults;
    }, [employee]),
    mode: 'onSubmit',
    delayError: 600,
  });

  const defaultCurrency = useContext(GlobalApiInfo).applicationConfigs.currency.currency;

  const getCareerHistory = async () => {
    try {
      const data = await getUserCareerHistory(getCookie('token'), employee.id);
      setCareerLog(data.career_history);
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  const refetchEmployees = async (heaveReload?: boolean) => {
    setIsLoading(true);
    try {
      const response = await getEmployeeRequest(router.query.id!, getCookie('token'));
      getCareerHistory();
      setEmployee(response.data);
      form.reset(response.data);
      heaveReload && !employeeData.profile_sections?.length && router.reload();
      setIsLoading(false);
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  const {
    formState: { defaultValues },
  } = form;

  const careerLogEmployeeData = {
    position: employee?.position?.title,
    seniority: employee?.seniority?.title,
    updatedDate: employee?.updated_at,
    salary: employee?.salary?.salary,
    payment_type: employee?.salary?.payment_type,
    project: employee?.projects?.[0]?.title,
    currency: employee?.salary?.currency ?? 'USD',
  };

  useEffect(() => {
    setCvHistoryState(cvHistory);

    return () => {
      setCanNotEdit(true);
    };
  }, [cvHistory, cvHistory.length]);

  const reRendedCvHistory = async () => {
    try {
      const res = await getEmployeeCvHistory(getCookie('token'), employee?.id!);
      setCvHistoryState(res.data);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  return {
    canNotEdit,
    setCanNotEdit,
    setTryingToLeave,
    tryingToLeave,
    modalIsOpen,
    setModalIsOpen,
    setAllowLeave,
    allowLeave,
    reRendedCvHistory,
    cvHistoryState,
    setCvHistoryState,
    formDefaults: defaultValues,
    dataIsSaved,
    setDataIsSaved,
    form,
    careerLogEmployeeData,
    actionsAreAdded,
    setActionsAreAdded,
    forceReloadSkills,
    setForceReloadSkills,
    addProfileInfoIsOpen,
    setAddProfileInfoIsOpen,
    employee,
    isLoading,
    refetchEmployees,
    setEmployee,
    careerLog,
    defaultCurrency,
  };
};
