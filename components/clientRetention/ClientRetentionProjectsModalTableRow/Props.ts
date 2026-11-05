import { ClientRetentionProjectItem, Currency } from 'types';

export type Props = {
  project: ClientRetentionProjectItem;
  currency: Currency;
  labels: string[];
  colWidth: string;
};
