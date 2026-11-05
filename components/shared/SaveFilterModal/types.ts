import { FilterOptions, SavedFilterFromApi, SetState } from 'types';

export type Props = {
  closeHandler: () => void;
  filterOptions: FilterOptions[];
  setFilterIsSaved: SetState<boolean>;
  setSavedFiltersState?: SetState<SavedFilterFromApi[]>;
};

export type FormValues = {
  name: string;
  is_private: 'no' | 'yes';
};
