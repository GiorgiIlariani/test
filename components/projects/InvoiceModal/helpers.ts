import { NextRouter } from 'next/router';
import { CreateInvoice, Currency, InvoiceTypes } from 'types';

export const getFormDefaultValues = (
  router: NextRouter,
  currency: Currency,
): Partial<CreateInvoice> => ({
  currency,
  staffs: undefined,
  expenses: undefined,
  service_fee_payment_agreed: false,
  fee_given_in: currency,
  discount_amount: 0,
  end_date: '',
  fee_shall_be_paid_in: currency,
  free_of_charge: 0,
  invoice_date: '',
  start_date: '',
  subtotal: 0,
  engagement_measurement_unit: 'hr',
  employee_info_to_show_in_invoice: ['employee', 'role'],
  holidays: [],
  vacations: [],
  vat_percentage: undefined,
  surcharge_percentage: null,
  fixed: [],
  monthly: [],
  bank_accounts: [],
  custom_fields: [],
});

export const getButtonText = (
  role: string,
  invoiceType: InvoiceTypes | undefined,
  sent: boolean,
) => {
  const saveText = sent ? 'Saved' : 'Save';
  if (invoiceType === 'contract asset') {
    return saveText;
  }
  if (role === 'CFO' || role === 'admin') {
    return saveText;
  }
  return sent ? 'Sent for approval' : 'Send for approval';
};
