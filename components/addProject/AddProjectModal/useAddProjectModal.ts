'use client';

import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useForm } from 'react-hook-form';
import { ClientDetail, ClientSummary, Currency, ProjectForm } from 'types';
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import {
  getProjectClientsRequest,
  postInternalProject,
  putInternalProject,
  storeProjectClientRequest,
} from 'services';
import { getCookie } from 'cookies-next';
import { PROJECT_TYPE } from 'config';
import { GlobalApiInfo } from 'context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { AddProjectFormValues, addProjectSchema } from 'schemas';

const getDefaultValues = (projectState?: ProjectForm, defaultCurrency?: Currency) => {
  return {
    logo: projectState?.logo ?? null,
    title: projectState?.title ?? '',
    owner_id: Number(projectState?.owner_id) || undefined,
    client_id: Number(projectState?.client?.id) || null,
    department_id: Number(projectState?.department?.id) || null,
    type: projectState?.type ?? PROJECT_TYPE.DEFAULT,
    currency: projectState?.currency || defaultCurrency || 'USD',
    temporary_clients: [],
  };
};

const getSubmitData = async (data: AddProjectFormValues) => {
  let clientId = data.client_id;
  let createdClient: ClientDetail | null = null;

  if (data.type === PROJECT_TYPE.DEFAULT && Number(clientId) < 0) {
    const selectedTemporaryClient = data.temporary_clients?.find(
      (client) => Number(client.id) === Number(clientId),
    );

    if (selectedTemporaryClient) {
      const { id: _temporaryId, ...clientData } = selectedTemporaryClient;
      createdClient = await storeProjectClientRequest(getCookie('token'), clientData);
      clientId = createdClient.id;
    }
  }

  return {
    submitData: {
      ...data,
      client_id: data.type === PROJECT_TYPE.DEFAULT ? clientId : null,
      department_id: data.type === PROJECT_TYPE.INTERNAL ? data.department_id : null,
      temporary_clients: undefined,
    },
    createdClient,
  };
};

export const useAddProjectModal = (
  projectState?: ProjectForm,
  setProjectState?: Dispatch<SetStateAction<ProjectForm | undefined>>,
  defaultCurrency?: Currency,
) => {
  const router = useRouter();
  const { departments } = useContext(GlobalApiInfo);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddProjectFormValues>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: getDefaultValues(projectState, defaultCurrency),
  });
  const { reset, resetField, watch, setValue } = form;

  const projectType = watch('type');
  const selectedClientId = watch('client_id');
  const temporaryClients = watch('temporary_clients') ?? [];
  const isTemporaryClientSelected = temporaryClients.some(
    (tempClient) => Number(tempClient.id) === Number(selectedClientId),
  );

  const clientOptions = [...clients, ...temporaryClients];

  const fetchClients = useCallback(async () => {
    try {
      const data = await getProjectClientsRequest(getCookie('token'));
      setClients(data);
    } catch (error) {
      toastGeneralError(error);
    }
  }, []);

  useEffect(() => {
    if (projectType !== PROJECT_TYPE.INTERNAL) {
      resetField('department_id');
    } else {
      resetField('client_id');
    }
  }, [projectType, resetField]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    reset(getDefaultValues(projectState, defaultCurrency));
  }, [reset, projectState, defaultCurrency]);

  const onCreateClient = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    const temporaryClient = {
      id: -Date.now(),
      name: trimmedName,
      logo: null,
      address: null,
      tax_id: null,
      payment_deadline_in_days: 0,
      payment_deadline_type: 'c' as const,
      agreement_number: null,
      documents: null,
    };

    setValue('temporary_clients', [...temporaryClients, temporaryClient], { shouldDirty: true });
    setValue('client_id', temporaryClient.id, { shouldDirty: true, shouldValidate: true });
  };

  const resetTemporaryClients = () => setValue('temporary_clients', []);

  const onSubmit = async (data: AddProjectFormValues) => {
    setIsSubmitting(true);

    try {
      const { submitData, createdClient } = await getSubmitData(data);

      if (createdClient) {
        setValue('client_id', createdClient.id, { shouldDirty: true, shouldValidate: true });
        setValue(
          'temporary_clients',
          temporaryClients.filter((client) => Number(client.id) !== Number(data.client_id)),
          { shouldDirty: true },
        );
        await fetchClients();
      }

      if (projectState?.id) {
        const newData = await putInternalProject(getCookie('token'), submitData, projectState?.id);
        setProjectState?.(newData);
        await router.replace(router.asPath.replace('addProject=1', ''));
        if (projectState.currency !== newData.currency || projectState.type !== newData.type) {
          router.reload();
        }
      } else {
        const newProject = await postInternalProject(getCookie('token'), submitData);
        router.push(`projects/${newProject?.id}/plan`);
      }
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

  const nonBillableDepartments = departments
    .filter((department) => !department.is_billable)
    .map((item) => ({ value: item.id, label: item.title }));

  return {
    form,
    onSubmit,
    nonBillableDepartments,
    clients: clientOptions,
    projectType,
    isSubmitting,
    onCreateClient,
    isTemporaryClientSelected,
    resetTemporaryClients,
  };
};
