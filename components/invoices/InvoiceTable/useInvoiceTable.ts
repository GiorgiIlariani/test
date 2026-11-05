'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { editInvoiceApprovalStatus, editInvoicePaidStatus } from 'services';
import { ApprovalStatus, Currency, InvoiceList, PaidStatus } from 'types';
import { Props } from './types';
import type { InvoiceTableHeaderItem } from './components/InvoiceTableHeader/types';
import { useInvoiceEmailPolling } from './useInvoiceEmailPolling';

const projectInvoicesHeaders: InvoiceTableHeaderItem[] = [
  { label: 'Unique ID' },
  { label: 'Invoice Date' },
  { label: 'Subtotal', align: 'right' },
  { label: 'Discount', align: 'right' },
  { label: 'Free', align: 'right' },
  { label: 'Total', align: 'right' },
  { label: 'Payment Status' },
  { label: 'Approval Status' },
  { label: 'Classification' },
  { label: 'Actions' },
];

const nonProjectInvoicesHeaders: InvoiceTableHeaderItem[] = [
  { label: 'Unique ID' },
  { label: 'Project' },
  { label: 'Project Owner' },
  { label: 'Invoice Date' },
  { label: 'Total', align: 'right' },
  { label: 'Payment Status' },
  { label: 'Approval Status' },
  { label: 'Classification' },
  { label: 'Actions' },
];

export const useInvoiceTable = (
  projectInvoices: Props['projectInvoices'],
  invoiceData: Props['invoiceData'],
  setInvoiceData: Props['setInvoiceData'],
  setSelectedInvoices: Props['setSelectedInvoices'],
  openPartiallyPaidHandler?: Props['openPartiallyPaidHandler'],
) => {
  const { invoiceEmailQueuedHandler } = useInvoiceEmailPolling(invoiceData, setInvoiceData);
  const router = useRouter();

  const [invoiceEmailModal, setInvoiceEmailModal] = useState<{
    invoiceId: number;
    isResend: boolean;
    clientName: string;
  }>();
  const [openedInvoice, setOpenedInvoice] = useState<number | undefined>();

  const openInvoiceEmailModal = (invoice: InvoiceList) => {
    setInvoiceEmailModal({
      invoiceId: invoice.id,
      isResend: Boolean(invoice.email_sent_at),
      clientName: invoice.internal_project.client?.name ?? 'Unknown client',
    });
  };

  // Keep onClose stable so polling updates don't reload the modal and reset its form.
  const closeInvoiceEmailModal = useCallback(() => {
    setInvoiceEmailModal(undefined);
  }, []);

  const openInvoiceView = (id: number) => {
    setOpenedInvoice(id);
  };

  const approvalStatusChangeHandler = async (
    status: ApprovalStatus,
    invoiceId: number,
    previousStatus: ApprovalStatus,
  ) => {
    if (!status) return;

    setInvoiceData((current) =>
      current.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, approval_status: status } : invoice,
      ),
    );

    setSelectedInvoices((current) =>
      current.map((invoice) =>
        invoice.invoiceId === invoiceId ? { ...invoice, status } : invoice,
      ),
    );

    try {
      await editInvoiceApprovalStatus(getCookie('token'), status, invoiceId);
    } catch (error) {
      setInvoiceData((current) =>
        current.map((invoice) =>
          invoice.id === invoiceId && invoice.approval_status === status
            ? { ...invoice, approval_status: previousStatus }
            : invoice,
        ),
      );

      setSelectedInvoices((current) =>
        current.map((invoice) =>
          invoice.invoiceId === invoiceId && invoice.status === status
            ? { ...invoice, status: previousStatus }
            : invoice,
        ),
      );

      toastGeneralError(error, router);
    }
  };

  const paymentStatusChangeHandler = async (
    status: PaidStatus,
    invoiceId: number,
    currency: Currency,
    previousStatus: PaidStatus,
  ) => {
    if (status === 'pp') {
      openPartiallyPaidHandler?.(invoiceId, currency);
      return;
    }

    setInvoiceData((current) =>
      current.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, payment_status: status } : invoice,
      ),
    );

    setSelectedInvoices((current) =>
      current.map((invoice) =>
        invoice.invoiceId === invoiceId ? { ...invoice, paid_status: status } : invoice,
      ),
    );

    try {
      await editInvoicePaidStatus(getCookie('token'), { payment_status: status }, invoiceId);
    } catch (error) {
      setInvoiceData((current) =>
        current.map((invoice) =>
          invoice.id === invoiceId && invoice.payment_status === status
            ? { ...invoice, payment_status: previousStatus }
            : invoice,
        ),
      );

      setSelectedInvoices((current) =>
        current.map((invoice) =>
          invoice.invoiceId === invoiceId && invoice.paid_status === status
            ? { ...invoice, paid_status: previousStatus }
            : invoice,
        ),
      );

      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    if (router.query.invoice_id && !!!router.query.reviewing) {
      openInvoiceView(+router.query.invoice_id);
    }
  }, []);

  const headers = projectInvoices ? projectInvoicesHeaders : nonProjectInvoicesHeaders;

  return {
    openInvoiceView,
    openedInvoice,
    setOpenedInvoice,

    approvalStatusChangeHandler,
    paymentStatusChangeHandler,

    invoiceEmailModal,
    openInvoiceEmailModal,
    closeInvoiceEmailModal,
    invoiceEmailQueuedHandler,

    headers,
  };
};
