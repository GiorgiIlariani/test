import {
  AllSubCategories,
  EmployeeFilterAndSortReducerDispatch,
  FilterOptions,
  FilterTopCategory,
  SavedFilterFromApi,
  SetState,
} from 'types';

export type Props = {
  dispatchEmployeeInfo: EmployeeFilterAndSortReducerDispatch;
  filterOptions: FilterOptions[];
  allSubCategories: AllSubCategories[];
  topCategories: readonly FilterTopCategory[];
  entireArrayOfFieldBeingGroupedByTier?: any[];
  refetchSubCategories?: () => void;
  filterText: string;
  filterSaving: boolean | undefined;
  setSavedFiltersState?: SetState<SavedFilterFromApi[]>;
};
