import type { Currency } from 'types';

export type InvoiceTableFooterProps = {
  projectInvoices: boolean;
  calculateTotalHandler: (
    amount: 'total' | 'discount_amount' | 'free_of_charge' | 'total_to_be_paid',
  ) => string;
  currency: Currency;
  loading: boolean;
};
