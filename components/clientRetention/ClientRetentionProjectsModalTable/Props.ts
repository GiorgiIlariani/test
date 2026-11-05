import { ClientRetentionProjectItem, Currency } from 'types';

export type Props = {
  projects: ClientRetentionProjectItem[] | undefined;
  loading: boolean;
  currency: Currency;
};
