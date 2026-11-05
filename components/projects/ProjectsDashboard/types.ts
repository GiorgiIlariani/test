import { Currency, ProjectDashboard } from 'types';

export type Props = {
  projects: ProjectDashboard[];
  isLoading: boolean;
  selectedFilteredStateString: string;
  currency: Currency;
};
