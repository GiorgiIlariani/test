import { ChangeEvent } from 'react';
import { SelectedStack } from 'types';

export type Props = {
  dropdownCategory:
    | 'primary_stack'
    | 'secondary_stack'
    | `project.${number}.technology`
    | (string & {});
  dropdownLabel: string;
  dropdownIsNotNeeded?: boolean;
  canNotEdit?: boolean;
  needsDraft?: boolean;
  doesNotNeedPreferred?: boolean;
  doesNotNeedExperience?: boolean;
  doesNotNeedCompetency?: boolean;
  allInputsChangeHandler?: (e?: ChangeEvent) => void;
  needsUnfilledState?: boolean;
  selectedStack: SelectedStack[];
  deleteHandler: (deletingStack: SelectedStack) => void;
};
