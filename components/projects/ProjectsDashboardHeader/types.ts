import { SetState, FilterState, Permission, ProjectDashboard, Recruiter, Currency } from 'types';

export type Props = {
  isOpen: boolean;
  setIsOpen: SetState<boolean>;
  filterState: FilterState;
  updateProjectFilterState: (newState: FilterState) => void;
  setFilterState: SetState<FilterState>;
  permissions: Permission[];
  isLoading: boolean;
  projects: ProjectDashboard[];
  projectOwners: Recruiter[];
  currency: Currency;
  defaultCurrency: Currency;
};
