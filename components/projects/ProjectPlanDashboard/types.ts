import { Dispatch, SetStateAction } from 'react';
import { Permission, ProjectForm } from 'types';

export type Props = {
  projectState: ProjectForm;
  projectIsLoading: boolean;
  projectId: number;
  setProjectState: Dispatch<SetStateAction<ProjectForm | undefined>>;
  permissions: Permission[];
};
