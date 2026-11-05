'use client';

import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { editPrivilegedUserRequest } from 'services';
import { PrivilegedUserEditFormFields, PrivilegedUsers } from 'types';
import { EditModalTab, PrivilegedUserEditModalProps, SetUsers } from '../types';
import { useDeleteUser } from './useDeleteUser';
import { usePasswordRecovery } from './usePasswordRecovery';

export const usePrivilegedUsersEditModal = (
  user: PrivilegedUsers,
  modalCloser: () => void,
  setUsers: SetUsers,
  roles: PrivilegedUserEditModalProps['roles'],
) => {
  const router = useRouter();

  const form = useForm<PrivilegedUserEditFormFields>({
    mode: 'onSubmit',
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      role: roles.find((role) => role.name === user.role)?.id.toString() ?? '1',
    },
    delayError: 600,
  });
  const { isDirty } = form.formState;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openedTab, setOpenedTab] = useState<EditModalTab>('account');

  const deleteUser = useDeleteUser(user, setUsers, modalCloser);
  const passwordRecovery = usePasswordRecovery(user.email);

  const submitHandler = async (data: PrivilegedUserEditFormFields) => {
    try {
      setIsSubmitting(true);
      await editPrivilegedUserRequest(getCookie('token'), user.id, data);
      setUsers(user.id, roles, data, true);
      modalCloser();
    } catch (error: any) {
      const errors: {
        [key in keyof PrivilegedUserEditFormFields]: string[];
      } = error?.response?.data?.errors;
      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error, router);
      }
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isDirty,
    isSubmitting,
    submitHandler,
    openedTab,
    setOpenedTab,
    ...deleteUser,
    ...passwordRecovery,
  };
};
