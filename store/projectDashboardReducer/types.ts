import { ProjectDashboardDispatchType, ProjectDashboardFilterReducerPayload } from 'types';

export type ReducerHandler = (
  state: ProjectDashboardFilterReducerPayload,
  action?: {
    payload: Partial<ProjectDashboardFilterReducerPayload>;
    type: ProjectDashboardDispatchType;
  },
) => ProjectDashboardFilterReducerPayload;
