import { Permission, ProjectsTraffic } from 'types';

export type Props = {
  project: ProjectsTraffic | Partial<ProjectsTraffic>;
  total?: number;
  permissions: Permission[];
};
