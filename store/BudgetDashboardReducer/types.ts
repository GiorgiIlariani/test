import { BudgetDashboardFilterReducerPayload, BudgetsDashboardDispatchType } from 'types';

export type ReducerHandler = (
  state: BudgetDashboardFilterReducerPayload,
  action?: {
    payload: Partial<BudgetDashboardFilterReducerPayload>;
    type: BudgetsDashboardDispatchType;
  },
) => BudgetDashboardFilterReducerPayload;
