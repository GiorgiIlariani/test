import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  BudgetForm,
  BudgetProject,
  BudgetStatus,
  Currency,
  Permission,
  PhasesForm,
  PositionSeniority,
  SetState,
  StaffMinimalEmployee,
} from 'types';

export type Props = {
  roles: PositionSeniority[];
  minimalUsers: StaffMinimalEmployee[];
  isSaving: boolean;
  setIsSaving: SetState<boolean>;
  currency: Currency;
  budgetId: number;
  setIsLoading: SetState<boolean>;
  isLoading: boolean;
  rateCardUpdated: boolean;
  countHolidaysUpdated: boolean;
  projectTypeUpdated: boolean;
  updateBudgetAfterRateCardRemoved: () => void;
  updateBudgetDates: (start_date: number | null, end_date: number | null) => void;
  projects: BudgetProject[];
  projectData: BudgetForm;
  setProjectId: (id: number, title: string, status?: BudgetStatus) => void;
  publishedBudgetIsInEditMode: boolean;
  setPublishedBudgetIsInEditMode: SetState<boolean>;
  phaseForm: UseFormReturn<{
    phase: PhasesForm[];
    subtotal: number;
    phase_subtotal: { [key: string]: number };
    phase_monthly: { [key: string]: number };
    selected_term: string;
    profit_margin: number;
  }>;
  shouldResetTotals?: boolean;
  setShouldResetTotals?: Dispatch<SetStateAction<boolean>>;
  shouldResetTerms?: boolean;
  setShouldResetTerms?: Dispatch<SetStateAction<boolean>>;
  permissions: Permission[];
  isCreateMode?: boolean;
};
