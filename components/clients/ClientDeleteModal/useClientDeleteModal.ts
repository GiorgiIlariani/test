import { PROJECT_TYPE } from 'config';
import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { deleteClientRequest } from 'services';
import { ClientDetail, ClientSummary } from 'types';

const getDefaultValues = (client: ClientDetail | null) => ({
  projects:
    client?.projects?.map((project) => ({
      id: project.id,
      type: project.type ?? PROJECT_TYPE.DEFAULT,
      client_id: null,
      department_id: project.type === PROJECT_TYPE.INTERNAL ? project.department_id : null,
    })) ?? [],
});

export const useClientDeleteModal = (
  onOpenChange: (isOpen: boolean) => void,
  selectedClient: ClientDetail | null,
  clients: ClientSummary[],
  refreshClients: () => void,
) => {
  const { departments } = useContext(GlobalApiInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: getDefaultValues(selectedClient),
  });

  const projectUpdates = form.watch('projects') ?? [];
  const assignedProjects = selectedClient?.projects ?? [];
  const hasAssignedProjects = assignedProjects.length > 0;

  useEffect(() => {
    form.reset(getDefaultValues(selectedClient));
  }, [selectedClient, form]);

  const clientOptions = clients
    .filter((clientOption) => clientOption.id !== selectedClient?.id)
    .map((clientOption) => ({
      value: clientOption.id,
      label: clientOption.name,
    }));

  const departmentOptions = departments
    .filter((department) => !department.is_billable)
    .map((department) => ({
      value: department.id,
      label: department.title,
    }));

  const canDelete =
    !hasAssignedProjects ||
    (projectUpdates.length === assignedProjects.length &&
      projectUpdates.every((project) =>
        project.type === PROJECT_TYPE.DEFAULT
          ? Boolean(project.client_id) && project.client_id !== selectedClient?.id
          : Boolean(project.department_id),
      ));

  const handleDelete = async () => {
    if (!selectedClient || !canDelete) return;

    setIsSubmitting(true);

    try {
      await deleteClientRequest(
        getCookie('token'),
        selectedClient.id,
        hasAssignedProjects
          ? {
              projects: projectUpdates.map((project) => ({
                id: project.id,
                type: project.type,
                client_id: project.type === PROJECT_TYPE.DEFAULT ? project.client_id : null,
                department_id:
                  project.type === PROJECT_TYPE.INTERNAL ? project.department_id : null,
              })),
            }
          : undefined,
      );

      refreshClients();
      onOpenChange(false);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    handleDelete,
    canDelete,
    isSubmitting,
    clientOptions,
    departmentOptions,
    hasAssignedProjects,
    assignedProjects,
    projectUpdates,
  };
};
