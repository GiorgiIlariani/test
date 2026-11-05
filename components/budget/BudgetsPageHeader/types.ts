import type { Permission } from 'types';

export type BudgetsPageHeaderProps = {
  permissions: Permission[];
  isInitialBudgetDataLoading: boolean;
  createBudgetHandler: () => Promise<void>;
};
