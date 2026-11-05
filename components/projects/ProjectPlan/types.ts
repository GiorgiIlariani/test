import { Permission, PositionSeniority, ProjectForm, StaffMinimalEmployee } from 'types';

export type Props = {
  projectState: ProjectForm;
  projectId: number;
  minimalUsers: StaffMinimalEmployee[];
  roles: PositionSeniority[];
  projectIsLoading: boolean;
  permissions: Permission[];
};
