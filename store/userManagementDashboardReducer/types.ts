import {
  UserManagementDashboardFilterReducerPayload,
  UserManagementDashboardFilterReducerPayloadDispatchType,
} from 'types';

export type ReducerHandler = (
  state: UserManagementDashboardFilterReducerPayload,
  action?: {
    payload: Partial<UserManagementDashboardFilterReducerPayload>;
    type: UserManagementDashboardFilterReducerPayloadDispatchType;
  },
) => UserManagementDashboardFilterReducerPayload;
