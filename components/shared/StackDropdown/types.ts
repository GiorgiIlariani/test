import { ChangeEvent } from 'react';
import { AnyObject, SetState, Skill } from 'types';

export type Props = {
  fieldNames: Skill[];
  dropdownCategory: string;
  dropdownLabel: string;
  dropdownIsNotNeeded?: boolean;
  id?: string;
  canNotEdit?: boolean;
  stringArray?: boolean;
  setAlreadySelectedSkills?: SetState<(string | number)[]>;
  alreadySelectedSkills?: (string | number)[];
  draft?: AnyObject | true;
  needsDraft?: boolean;
  needToAddSelectedFieldsToSelectedSkills?: boolean;
  doesNotNeedPreferred?: boolean;
  doesNotNeedExperience?: boolean;
  doesNotNeedCompetency?: boolean;
  dropdownPlaceholder: string;
  allInputsChangeHandler?: (e?: ChangeEvent | Skill) => void;
  needsUnfilledState?: boolean;
  extraTogglerClasses?: string;
  doesNotNeedTogglerArrow?: boolean;
  breadCrumbsDoNotNeedRemoveXWhenNotOpen?: boolean;
  extraBreadCrumbClasses?: string;
  extraBreadCrumbWrapperClasses?: string;
  extraTopWrapperClasses?: string;
  extraCloseHandler?: (...args: any[]) => void;
  dropdownStartText?: string;
  showColorsInDropDown?: boolean;
  reactWindowHeight?: number;
};

export type NewFieldTypes = {
  id: number;
  title: string;
  experience_duration: 0;
  months_of_experience: 0;
  years_of_experience: 0;
  isSelected: boolean;
  is_preferred: boolean;
  competence_rate: number;
  localId: number;
  color: string | undefined;
};
