'use client';

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Currency, UnpaidInvoice } from 'types';

export const useInvoiceWidget = (currency: Currency, invoices?: UnpaidInvoice[]) => {
  const form = useForm({
    defaultValues: {
      invoice: 'All',
    },
    mode: 'onSubmit',
  });

  const router = useRouter();

  const filteredInvoices = invoices?.filter(
    (invoice) =>
      form.getValues('invoice') === 'All' ||
      form.getValues('invoice')?.toLocaleLowerCase() === invoice.status,
  );

  const total = filteredInvoices?.reduce((sum, invoice) => sum + invoice.total[currency], 0);

  const redirectToInvoiceWithFilter = () => {
    const minifiedFilterOptions = [
      {
        childConditions: [],
        ConditionIsAnd: false,
        id: 'np',
        isIsNot: true,
        type: 'payment_status',
        meta: undefined,
        value: 'Not paid',
        filter_type: 'select',
        group: '',
      },
    ];
    const hashed = Buffer.from(JSON.stringify(minifiedFilterOptions)).toString('base64');

    router.push(`/invoices?filter=${hashed}`);
  };

  return { form, router, total, filteredInvoices, redirectToInvoiceWithFilter };
};
