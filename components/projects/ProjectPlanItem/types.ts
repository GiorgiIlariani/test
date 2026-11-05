import { PhasesForm, BudgetStatus, SetState, Permission } from 'types';

export type Props = {
  roles: any;
  minimalUsers: any;
  projectState: any;
  budget: {
    phase: PhasesForm[];
    id: number | null;
    title: string;
    status: BudgetStatus;
  };
  index: number;
  isOpen: number | undefined;
  setIsOpen: SetState<number | undefined>;
  setSelectedScopeId: SetState<number | null>;
  setSelectedTermId: SetState<number | null>;
  selectedTermId: number | null;
  setTotalNav: SetState<string>;
  inputName: `budgets.${number}`;
  setProjectIsUpdated: SetState<boolean>;
  budgets: { phase: PhasesForm[]; id: number | null; title: string; status: BudgetStatus }[];
  setTermsAndBudgetsIsLoading: SetState<boolean>;
  getTermsAndBudgets?: () => Promise<void>;
  permissions: Permission[];
};
