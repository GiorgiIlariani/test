import { Dispatch, SetStateAction } from 'react';
import { Permission, ProjectForm, StaffMinimalEmployee } from 'types';

export type Props = {
  employees: StaffMinimalEmployee[];
  projectId: number;
  autoApproveTimeLogs: boolean;
  autoFillTimeLogs: boolean;
  setProjectState: Dispatch<SetStateAction<ProjectForm | undefined>>;
  projectIsLoading?: boolean;
  permissions: Permission[];
};
