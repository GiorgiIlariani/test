import { AddingFilterOption, AllSubCategories, SavedFilterFromApi, SetState } from 'types';

export type Props = {
  subCategory: AllSubCategories;
  addNewCondition: (field: AddingFilterOption) => void;
  removeConditionHandler: ({
    type,
    value,
    id,
    children,
  }: {
    type: string;
    value: string;
    id: string | number;
    children: AllSubCategories[] | undefined;
  }) => void;
  checkedCondition: boolean;
  type: string;
  fieldIsEmployee?: boolean;
  isChild?: boolean;
  filter_type: string;
  setSavedFiltersState: SetState<SavedFilterFromApi[]>;
};
