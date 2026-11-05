import { UseFormReturn } from 'react-hook-form';
import { BudgetForm, BudgetProject, BudgetStatus, PhasesForm, SetState } from 'types';

export type Props = {
  isBookModalOpen: boolean;
  setIsBookModalOpen: SetState<boolean>;
  projects: BudgetProject[];
  budgetData: {
    phase: PhasesForm[];
    subtotal: number;
    phase_subtotal: { [key: string]: number };
    selected_term: string;
    profit_margin: number;
  };
  projectData: BudgetForm;
  setIsSuccessOpen: SetState<boolean>;
  setPublishedBudgetData: SetState<
    | {
        publishedPhases: number;
        draftPhases: number;
        isNewScope: boolean;
        newBudgetId: number;
        project_id: number;
        project_title: string;
        isDeleted: boolean;
        isDrafted: boolean;
      }
    | undefined
  >;
  setProjectId: (id: number, title: string, status?: BudgetStatus) => void;
  getBudgetingPhasesHandler: () => void;
  publishedBudgetIsInEditMode: boolean;
  setPublishedBudgetIsInEditMode: SetState<boolean>;
  setPhaseStatusAfterPublish: (terms: PhasesForm[]) => void;
  editPhaseId?: number | boolean;
  budgetTotal?: { subtotal: number; profit_margin: number };
  closeBookModal?: () => void;
  allPhases: PhasesForm[];
  budgetForm: UseFormReturn<{
    phase: PhasesForm[];
    subtotal: number;
    phase_subtotal: { [key: string]: number };
    phase_monthly: { [key: string]: number };
    selected_term: string;
    profit_margin: number;
  }>;
  arePublicHolidaysCounted: boolean;
};
