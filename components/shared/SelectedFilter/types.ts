import {
  AddingInsideSelectedFilter,
  EmployeeFilterAndSortReducerDispatch,
  FilterOptions,
  FilterTopCategory,
  SetState,
} from 'types';

export type Props = {
  field: FilterOptions;
  removeConditionHandler: (
    {
      type,
      value,
      id,
    }: {
      type: string;
      value: string;
      id: string | number;
    },
    removingEntireThing?: boolean,
  ) => void;
  fieldDetails: FilterOptions[];
  i: number;
  setFieldDetails: EmployeeFilterAndSortReducerDispatch;
  setAddingInsideSelectedFilter: (state: AddingInsideSelectedFilter) => void;
  filterOpenHandler: () => void;
  andBefore?: boolean;
  setSelectedField: SetState<string>;
  overflowToggleHandler: () => void;
  filterTopCategories: readonly FilterTopCategory[];
  nextFilterOverflows?: boolean;
  // only needed if and before is true
  previousFilter?: FilterOptions;
};

export type TopCategoryType = (
  field: FilterOptions,
  filterTopCategories: readonly FilterTopCategory[],
) => FilterTopCategory | undefined;
