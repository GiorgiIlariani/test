import { Currency, ProjectInvoicesBudget } from 'types';

export type Props = {
  projectIsLoading: boolean;
  isWidgetLoading: boolean;
  invoiceInfo: ProjectInvoicesBudget | undefined;
  currency: Currency;
};
