'use client';

import { convertNumbersAsPrice, generateInvoicePDF, getQuery } from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Invoice, InvoiceList, InvoiceTypes } from 'types';
import { Props } from './types';
import { changeStatusHandler } from 'helpers/invoices/invoicesPageUtils';
import { GlobalApiInfo } from 'context';

export const useInvoiceView = (
  handleClose: () => void,
  updateInvoicesList: Props['updateInvoicesList'],
  setInvoiceData: Props['setInvoiceData'],
) => {
  const form = useForm<Invoice>({
    mode: 'onSubmit',
    delayError: 600,
  });
  const [changingStatus, setChangingStatus] = useState(false);
  const [changeStatusLoading, setChangeStatusLoading] = useState(false);
  const [changingPartiallyPaid, setChangingPartiallyPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceType, setInvoiceType] = useState<InvoiceTypes>('');
  const [errorStatus, setErrorStatus] = useState(0);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [isInEdit, setIsInEdit] = useState(false);
  const [haveOtherExpenses, setHaveOtherExpenses] = useState(false);
  const { user } = useContext(GlobalApiInfo);
  const {
    formState: { defaultValues },
  } = form;

  const router = useRouter();
  const pageIndex = router.query.page ? parseInt(router.query.page as string) : '1';
  const currentProject = router.query.project ? router.query.project![0] : undefined;
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState({
    payment_status: form.getValues('payment_status'),
    partially_paid_amount: convertNumbersAsPrice(+form.getValues('partially_paid_amount')! || 0),
  });
  const [pdfDropdownIsOpen, setPdfDropdownIsOpen] = useState(false);

  const pdfDropdownRef = useRef<HTMLDivElement>(null);

  const openChangingStatusModal = () => {
    setChangingStatus(true);
  };

  const formatter = useMemo(() => {
    return new Intl.NumberFormat('eu', {
      currency: form.getValues('currency') ?? 'EUR',
      style: 'currency',
      maximumFractionDigits: 1,
      currencyDisplay: 'narrowSymbol',
    });
  }, [form]);

  const refreshProjectInvoices = () => {
    !currentProject && updateInvoicesList?.(getQuery('page')?.toString() || '0');
  };

  const closeHandler = () => {
    if (changingStatus) {
      if (defaultValues?.payment_status) {
        form.setValue('payment_status', defaultValues.payment_status);
      }
      setChangingStatus(false);
    } else if (changingPartiallyPaid) {
      setChangingPartiallyPaid(false);
      setChangingStatus(true);
    } else {
      handleClose();
      const url = new URL(window.location.href);
      refreshProjectInvoices();
      url.searchParams.delete('invoice_id');
      window.history.replaceState({ path: url.href }, '', url.href);
    }
  };

  const changeStatusSubmitHandler = async () => {
    await changeStatusHandler(
      form.getValues,
      changingPartiallyPaid,
      setChangeStatusLoading,
      setChangingPartiallyPaid,
      form.setFocus,
      form.setError,
      setChangingStatus,
    );
    setCurrentPaymentStatus({
      payment_status: form.getValues('payment_status'),
      partially_paid_amount: convertNumbersAsPrice(+form.getValues('partially_paid_amount')! || 0),
    });

    setInvoiceData((prev) => {
      let newState = [...prev];
      const partiallyPaidAmount = form
        .getValues('partially_paid_amount')
        ?.toString()
        .replaceAll(',', '');

      const paymentStatus = form.getValues('payment_status');

      return newState.map((item) =>
        item.id === form.getValues('id')
          ? {
              ...item,
              partially_paid_amount: convertNumbersAsPrice(+partiallyPaidAmount! || 0),
              payment_status: paymentStatus || 'np',
            }
          : item,
      ) as InvoiceList[];
    });
    updateInvoicesList?.(pageIndex?.toString() ?? '1');
  };

  const pdfExportHandler = async (language: 'en' | 'ka') => {
    setExportingPdf(true);
    setPdfDropdownIsOpen(false);
    await generateInvoicePDF(
      [form.getValues('id')],
      () => {},
      true,
      language,
      form.getValues('generated_id'),
    );
    setExportingPdf(false);
  };

  const classification = useWatch({ control: form.control, name: 'type' });

  const toggleEditMode = () => {
    setHaveOtherExpenses(!!form.getValues('expenses')?.length);
    setIsInEdit((prev) => !prev);
    form.reset();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (pdfDropdownRef.current && !pdfDropdownRef.current.contains(event.target as Node)) {
      setPdfDropdownIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    changeStatusSubmitHandler,
    openChangingStatusModal,
    changingPartiallyPaid,
    setHaveOtherExpenses,
    changeStatusLoading,
    haveOtherExpenses,
    pdfExportHandler,
    changingStatus,
    setErrorStatus,
    classification,
    setInvoiceType,
    toggleEditMode,
    exportingPdf,
    closeHandler,
    errorStatus,
    invoiceType,
    setIsInEdit,
    setLoading,
    formatter,
    isInEdit,
    loading,
    form,
    user,
    currentPaymentStatus,
    pdfDropdownIsOpen,
    setPdfDropdownIsOpen,
    pdfDropdownRef,
  };
};
