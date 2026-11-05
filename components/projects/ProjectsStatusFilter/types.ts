import { FilterState, SetState } from 'types';

export type Props = {
  isOpen: boolean;
  setIsOpen: SetState<boolean>;
  filterState: FilterState;
  setFilterState: SetState<FilterState>;
  updateProjectFilterState?: (newState: FilterState) => void;
};
