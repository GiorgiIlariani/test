import { Dispatch, RefObject, SetStateAction } from 'react';
import { BudgetForm, Currency, Permission, SetState } from 'types';

export type Props = {
  permissions: Permission[];
  projects: { id: number | null; title: string; currency: Currency }[];
  onProjectTitleChangeHandler: (value: {
    id: number | string;
    title: string;
    currency?: Currency;
  }) => void;
  submitOnBlur: (data: BudgetForm, preserveEndDate?: boolean, preserveStartDate?: boolean) => void;
  isSaving: boolean;
  rateCards: { id: number; title: string }[];
  isLoading?: boolean;
  editBudgetStateChange: () => void;
  publishedBudgetIsInEditMode: boolean;
  setPublishedBudgetIsInEditMode: Dispatch<SetStateAction<boolean>>;
  resetToDefaultBudget?: () => void;
  setProjectTypeUpdated: Dispatch<SetStateAction<boolean>>;
  buttonRef: RefObject<HTMLButtonElement>;
  dropDownRef: RefObject<HTMLDivElement>;
  isActionsClicked: boolean;
  setIsActionsClicked: SetState<boolean>;
  toggleAdditionalButtons: () => void;
  isCreateMode?: boolean;
};
