import {
  FilterOptions,
  ProjectTitle,
  Recruiter,
  SavedFilterFromApi,
  StaffMinimalEmployee,
  ClientSummary,
} from 'types';

export type HandlerProps = {
  filters?: FilterOptions[];
  termStatuses?: string[];
  newDates?: {
    endDate: Date;
    startDate: Date;
  };
  abortController?: AbortController;
  getProjectsTableHandler?: boolean;
};

export type DataProps = {
  employees: StaffMinimalEmployee[];
  projectManagers: Recruiter[];
  clients: ClientSummary[];
  backDates: {
    dates:
      | {
          startDate: string;
          endDate: string;
        }
      | undefined;
  };
  savedFilters: SavedFilterFromApi[];
  projects: ProjectTitle[];
};
