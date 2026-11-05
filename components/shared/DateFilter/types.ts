import { RefObject } from 'react';
import {
  AddingFilterOption,
  AddingInsideSelectedFilter,
  FilterOptions,
  FilterTopCategory,
} from 'types';

export type Props = {
  dateDropdownRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  backHandler: () => void;
  addOrEditDateFilter: (fieldData: AddingFilterOption) => void;
  entireSelectedField?: FilterTopCategory;
  filterOptions: FilterOptions[];
  addingInsideSelectedFilter: AddingInsideSelectedFilter | undefined;
  wrapperClasses?: string;
  excludeDates?: Date[];
  doNotShowLabel?: boolean;
};
