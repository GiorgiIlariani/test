import { ChangeEvent } from 'react';
import { SelectedStack, Skill } from 'types';

export type Props = {
  selectedStack: SelectedStack[];
  deleteHandler: (deletingStack: SelectedStack) => void;
  allInputsChangeHandler?: (e?: ChangeEvent | Skill) => void;
  canNotEdit?: boolean;
  doesNotNeedRemoveXOnNotOpen: boolean | undefined;
  extraBreadCrumbClasses: string | undefined;
  isOpen: boolean;
  dropdownCategory: string;
};
