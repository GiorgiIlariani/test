import { Currency, SetState } from 'types';

export type Props = {
  currency: Currency;
  selectedScopeId: number;
  setSelectedScopeId: SetState<number | null> | undefined;
  selectedTermId: number;
  setSelectedTermId: SetState<number | null> | undefined;
  totalNav: string;
  setTotalNav: SetState<string>;
  selectedTermTypeIsMonthly?: boolean;
  projectIsUpdated: boolean;
};
