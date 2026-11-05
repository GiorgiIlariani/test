'use client';

import { PROJECT_TYPE } from 'config';
import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useContext, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { getProjectClientsRequest, getProjectManagers } from 'services';
import { BudgetProject, ClientSummary, Currency, ProjectType, SetState } from 'types';

export const useBookModalProjectInfo = (
  projects: BudgetProject[],
  setSelectedProjectCurrency: SetState<Currency>,
  setSelectedProject: SetState<BudgetProject | null>,
  setSelectedProjectType: SetState<ProjectType>,
) => {
  const [projectManagers, setProjectManagers] = useState<{ id: number; title: string }[]>([]);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const { register, getValues, setValue, reset, resetField, control } = useFormContext();

  const findProject = (projectId: number) => {
    const selectedProject = projects.find((project) => project.id == +projectId);
    setSelectedProject(selectedProject ?? null);
    setSelectedProjectCurrency(selectedProject?.currency ?? 'USD');
    setSelectedProjectType(selectedProject?.type ?? 'default');
    return selectedProject;
  };

  const { departments } = useContext(GlobalApiInfo);

  const nonBillableDepartments = departments
    .filter((department) => !department.is_billable)
    .map((item) => ({ id: item.id as number, title: item.title }));

  const getProjectManagersHandler = async () => {
    try {
      const response = await getProjectManagers(getCookie('token'));
      setProjectManagers(
        response.data.map((item: { id: number; name: string }) => ({ ...item, title: item.name })),
      );
    } catch (_error) {}
  };

  const getClients = async () => {
    try {
      const response = await getProjectClientsRequest(getCookie('token'));
      setClients(response);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const projectInput = useWatch({ name: 'internal_project_id', control });
  const projectType = useWatch({ name: 'project_type', control });
  const selectedClientId = useWatch({ name: 'client_id', control });
  const temporaryClients = useWatch({ name: 'temporary_clients', control }) ?? [];
  const isTemporaryClientSelected = temporaryClients.some(
    (tempClient: { id: number }) => Number(tempClient.id) === Number(selectedClientId),
  );

  const clientOptions = [...clients, ...temporaryClients].map((client) => ({
    id: client.id,
    title: client.name,
  }));

  const createTemporaryClient = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    const temporaryClient = {
      id: -Date.now(),
      name: trimmedName,
      logo: null,
      address: undefined,
      tax_id: undefined,
      payment_deadline_in_days: 0,
      payment_deadline_type: 'c' as const,
      agreement_number: undefined,
      documents: [],
    };

    setValue('temporary_clients', [...temporaryClients, temporaryClient], { shouldDirty: true });
    setValue('client_id', temporaryClient.id, { shouldDirty: true, shouldValidate: true });
  };

  useEffect(() => {
    getProjectManagersHandler();
    getClients();
  }, []);

  useEffect(() => {
    if (projectType !== PROJECT_TYPE.INTERNAL) {
      resetField('department_id');
    } else {
      resetField('client_id');
    }
  }, [projectType, resetField]);

  return {
    register,
    getValues,
    setValue,
    reset,
    findProject,
    setSelectedProject,
    projectInput,
    projectManagers,
    nonBillableDepartments,
    clients,
    clientOptions,
    createTemporaryClient,
    isTemporaryClientSelected,
  };
};
