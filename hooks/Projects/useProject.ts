'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  InvoiceTypes,
  PositionSeniority,
  ProjectForm,
  Recruiter,
  StaffMinimalEmployee,
} from 'types';
import {
  deleteProject,
  getGlobalRoles,
  getMinimalUsers,
  getProject,
  getProjectManagers,
} from 'services';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useParams } from 'next/navigation';

export const useProject = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = +router.query?.project?.[0]!;

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoicesIsOpen, setInvoicesIsOpen] = useState<InvoiceTypes | undefined>();
  const [projectManagers, setProjectManagers] = useState<Recruiter[]>([]);
  const [minimalUsers, setMinimalUsers] = useState<StaffMinimalEmployee[]>([]);
  const [roles, setRoles] = useState<PositionSeniority[]>([]);
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [projectState, setProjectState] = useState<ProjectForm>();
  const [projectIsLoading, setProjectIsLoading] = useState(true);

  const isTabActive = (tab: 'dashboard' | 'plan' | 'invoices' | 'timesheets') => {
    return params.project?.includes(tab);
  };

  const getInitialData = async () => {
    setProjectIsLoading(true);

    try {
      const token = getCookie('token');

      const [projectData, roles, minimalUsers, projectManagers] = await Promise.all([
        getProject(token, projectId),
        getGlobalRoles(token),
        getMinimalUsers(token, 1),
        getProjectManagers(token),
      ]);
      setProjectState(projectData.data);
      setMinimalUsers(
        minimalUsers.data?.map((employee) => ({
          ...employee,
          title: employee.name!,
        })),
      );
      setRoles(roles.data);
      setProjectManagers(projectManagers.data);
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setProjectIsLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const deleteProjectHandler = async () => {
    try {
      await deleteProject(getCookie('token'), projectId);
      setDeleteDialog(false);

      await router.push(`/projects`);
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  return {
    deleteDialog,
    setDeleteDialog,
    deleteProjectHandler,
    loading,
    setLoading,
    invoicesIsOpen,
    setInvoicesIsOpen,
    router,
    projectManagers,
    minimalUsers,
    invoiceCreated,
    setInvoiceCreated,

    projectState,
    projectIsLoading,
    isTabActive,
    projectId,
    roles,
    setProjectState,
  };
};
