import { ClientRetentionProjectItem, Currency } from 'types';

export type Props = {
  title: string;
  projects: ClientRetentionProjectItem[] | undefined;
  loading: boolean;
  currency: Currency;
  selectedQuarter: { quarter: string; revenue: any } | undefined;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};
