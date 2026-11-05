import { Permission } from 'types';
import { ProjectHeadTypes, ProjectsTraffic } from 'types/traffic';

export type Props = {
  projectsTraffic: ProjectsTraffic[];
  sortTable: (sortBy: ProjectHeadTypes) => void;
  sortField: ProjectHeadTypes;
  order: 'asc' | 'desc';
  projectIsLoading: boolean;
  permissions: Permission[];
};
