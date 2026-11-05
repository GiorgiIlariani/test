import { Dispatch, SetStateAction } from 'react';
import { UseFieldArrayAppend } from 'react-hook-form';
import {
  Billing,
  BudgetStatus,
  Currency,
  Permission,
  PhasesForm,
  PositionSeniority,
  SetState,
  StaffMinimalEmployee,
} from 'types';

export type Props = {
  i: number;
  id: number;
  roles: PositionSeniority[];
  minimalUsers?: StaffMinimalEmployee[];
  setIsSaving?: SetState<boolean>;
  setIsOpen: SetState<number | undefined>;
  isOpen: boolean;
  setBudgetIsUpdated: SetState<boolean>;
  calculateProgress?: (
    i: number,
    type: Billing,
  ) => {
    filledPercentage: number;
    fieldQuantity: number;
    allFieldsCount: number;
    isEngagementFilled?: boolean;
    isRateFilled?: boolean;
    isRoleFilled?: boolean;
    isStaffFilled?: boolean;
    progressList?: { title: string; filled: boolean }[];
  };
  setSelectedScopeId?: React.Dispatch<React.SetStateAction<string | number | null>>;
  setSelectedTermId: React.Dispatch<React.SetStateAction<string | number | null>>;
  currency: Currency;
  setTotalNav: Dispatch<SetStateAction<string>>;
  setSubtotalEditIsActive?: Dispatch<SetStateAction<boolean>>;
  budgetIsUpdated?: boolean;
  updateBudgetAfterRateCardRemoved?: () => void;
  updateBudgetDates?: (start_date: number | null, end_date: number | null) => void;
  removePhaseHandler?: (termId: number, i?: number) => void;
  isReadOnly: boolean;
  append?: UseFieldArrayAppend<
    {
      phase: PhasesForm[];
      subtotal: number;
      phase_subtotal: { [key: string]: number };
      phase_monthly: { [key: string]: number };
      selected_term: string;
      profit_margin: number;
    },
    'phase'
  >;
  isProjectPage?: boolean;
  inputName: `phase.${number}`;
  phaseId?: number;
  budgetLink?: string;
  deleteTermHandler?: SetState<number | null | boolean>;
  publishedBudgetIsInEditMode?: boolean;
  rateCardId?: number | null;
  projectId?: number | { id: number | string | null; title: string } | null;
  phases?: PhasesForm[];
  setBudgetPhaseListingItemEdited?: Dispatch<SetStateAction<boolean>>;
  budget?: {
    phase: PhasesForm[];
    id: number | null;
    title: string;
    status: BudgetStatus;
  };
  budgets?: { phase: PhasesForm[]; id: number | null; title: string; status: BudgetStatus }[];
  setTermsAndBudgetsIsLoading?: SetState<boolean>;
  budgetWhichTermsToMove?: number;
  setBudgetWhichTermsToMove?: SetState<number | undefined>;
  openDeleteBudgetModal?: boolean;
  setOpenDeleteBudgetModal?: SetState<boolean>;
  arePublicHolidaysCounted?: boolean;
  getTermsAndBudgets?: () => Promise<void>;
  setProjectIsUpdated?: SetState<boolean>;
  isProjectInternal: boolean;
  permissions: Permission[];
};
