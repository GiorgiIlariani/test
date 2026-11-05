'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { editPersonalInformation } from 'services';
import { ShowPageEmployee } from 'types';
import { PersonalInfoFormValues, personalInfoSchema } from './personalInfoSchema';
import { GlobalApiInfo } from 'context';

export const usePersonalInfo = (employee: ShowPageEmployee, refetchEmployeeData: () => void) => {
  const { refetchUser } = useContext(GlobalApiInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const defaultValues = useMemo<PersonalInfoFormValues>(
    () => ({
      first_name: employee.first_name ?? '',
      last_name: employee.last_name ?? '',
      personal_email: employee.personal_email ?? '',
      id_number: employee.id_number ?? '',
      zip_code: employee.zip_code != null ? String(employee.zip_code) : '',
      phone: employee.phone ?? '',
      street_address: employee.street_address ?? '',
      location: employee.location ?? '',
    }),
    [employee],
  );

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      setIsLoading(true);

      await editPersonalInformation(employee.id, getCookie('token'), data);

      setIsModalOpen(false);
      refetchEmployeeData();
      refetchUser();
    } catch (e: any) {
      if (e?.message.includes('frontValidation')) return;

      if (!('response' in e)) return toastGeneralError(e);

      if (e.response?.status === 422)
        handleBackendErrors(e.response?.data.errors, form.setFocus, form.setError);
    } finally {
      setIsLoading(false);
    }
  };

  const setModalOpen = (open: boolean) => {
    form.reset(defaultValues);
    setIsModalOpen(open);
  };

  return { form, onSubmit, setModalOpen, isModalOpen, loading };
};
