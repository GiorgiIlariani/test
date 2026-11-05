import { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  AllSubCategories,
  Currency,
  EmployeeFilterAndSortReducerDispatch,
  FilterOptions,
  FilterTopCategory,
  Permission,
  SavedFilterFromApi,
  SetState,
} from 'types';

export type Props = {
  searchable?: boolean;
  dispatchEmployeeInfo?: EmployeeFilterAndSortReducerDispatch;
  hideOverflow?: boolean;
  permissions: Permission[];
  allSubCategories?: AllSubCategories[];
  filterOptions?: FilterOptions[];
  subCategoryThatShouldBeGroupedByTier?: string;
  topCategories?: readonly FilterTopCategory[];
  entireArrayOfFieldBeingGroupedByTier?: any[];
  refetchSubCategories?: () => void;
  disableLoading?: boolean | undefined;
  filterText?: string;
  filterSaving?: boolean;
  setSavedFiltersState?: SetState<SavedFilterFromApi[]>;
  children: ReactNode;
  notResponseError?: boolean;
  setNotResponseError?: SetState<boolean>;
  disableHeader?: boolean;
  parentClass?: string;
  drawerSidebar?: boolean;
  containerClassName?: string;
  setCurrency?: Dispatch<SetStateAction<Currency>>;
  externalCurrencyChangeHandler?: (currency: Currency) => void;
};
