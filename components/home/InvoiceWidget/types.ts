import { Currency, UnpaidInvoice } from 'types';

export type Props = {
  isLoading: boolean;
  invoices?: UnpaidInvoice[];
  isWidgetLoading: boolean;
  currency: Currency;
};
