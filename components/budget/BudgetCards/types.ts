import { Budgeting, BudgetNavTypes, Permission, SetState } from 'types';

export type Props = {
  recents: Budgeting[];
  isInitialBudgetDataLoading: boolean;
  isBudgetLoading: boolean;
  navState: BudgetNavTypes;
  setBudgetSort: SetState<string | undefined>;
  budgetSort: string | undefined;
  filteredBudgetData: Budgeting[];
  deleteHandler: (id: number) => void;
  archiveHandler: (id: number) => void;
  unarchiveHandler: (id: number) => void;
  navChangeHandler: (state: BudgetNavTypes) => Promise<void>;
  permissions: Permission[];
};
