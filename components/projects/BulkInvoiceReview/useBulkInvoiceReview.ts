'use client';

import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { getInvoiceViewData, toastGeneralError } from 'helpers';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { approveInvoiceRequest, rejectInvoiceRequest } from 'services';
import { Currency, Invoice, InvoiceTypes, SetState } from 'types';
import { Props } from './types';
import { changeStatusHandler } from 'helpers/invoices/invoicesPageUtils';

export const useBulkInvoiceReview = (
  selectedInvoices: Props['selectedInvoices'],
  closeReviewModal: () => void,
  setSelectedInvoices: Props['setSelectedInvoices'],
  isOpen?: boolean,
  setReviewingInvoiceData?: SetState<{
    currency: Currency;
    internal_project_id: number;
    project_name: string;
  }>,
  canNotEdit?: Props['canNotEdit'],
) => {
  const [selectedInvoice, setSelectedInvoice] = useState({
    ...selectedInvoices[0],
    index: 0,
  });
  const [errorStatus, setErrorStatus] = useState(0);
  const [contractQuestionModal, setContractQuestionModal] = useState(false);
  const [contractValidationModal, setContractValidationModal] = useState(false);
  const [invoiceType, setInvoiceType] = useState<InvoiceTypes>('');
  const [changingStatus, setChangingStatus] = useState(false);
  const [changeStatusLoading, setChangeStatusLoading] = useState(false);
  const [changingPartiallyPaid, setChangingPartiallyPaid] = useState(false);
  const form = useForm<Invoice>({
    mode: 'onSubmit',
    defaultValues: {
      currency: 'USD',
      staffs: [],
    },
    delayError: 600,
  });

  const router = useRouter();
  const {
    formState: { defaultValues },
  } = form;

  const currency = useWatch({
    control: form.control,
    name: 'currency',
  });

  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const currentPage = router.query.page ? router.query.page : '1';

  const refreshProjectInvoices = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({ path: baseUrl }, '', baseUrl);
    router.reload();
  };

  useEffect(() => {
    (async () => {
      if (selectedInvoice.invoiceId) {
        setLoading(true);
        const returnData = await getInvoiceViewData(
          selectedInvoice.invoiceId,
          form,
          [],
          setLoading,
          setErrorStatus,
        );

        if (returnData) {
          setSelectedInvoices &&
            setSelectedInvoices((prev) => {
              const newState = [...prev];
              newState[selectedInvoice.index] = {
                status: returnData.approval_status,
                invoiceId: returnData.id,
                paid_status: returnData.payment_status,
              };
              return newState;
            });
          setSelectedInvoice({
            index: 0,
            invoiceId: returnData.id,
            paid_status: returnData.payment_status,
            status: returnData.approval_status,
          });
          setReviewingInvoiceData &&
            setReviewingInvoiceData({
              currency: returnData.currency ?? 'USD',
              internal_project_id: returnData.internal_project_id as number,
              project_name: returnData.invoice_name as string,
            });
        }
      }
    })();
  }, [form, router, setSelectedInvoices]);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat('eu', {
      currency: currency ?? 'EUR',
      style: 'currency',
      maximumFractionDigits: 1,
      currencyDisplay: 'narrowSymbol',
    });
  }, [currency]);

  const nextInvoice = () => {
    setSelectedInvoice((prev) => {
      const nextInvoice = selectedInvoices[prev.index + 1];
      getInvoiceViewData(
        nextInvoice.invoiceId,
        form,
        [],
        setLoading,
        setErrorStatus,
        setInvoiceType,
      );
      return {
        ...nextInvoice,
        index: prev.index + 1,
      };
    });
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
      !canNotEdit && refreshProjectInvoices();
      closeReviewModal();
    }
  };

  const approveInvoiceHandler = () => {
    setSelectedInvoices &&
      setSelectedInvoices((prevSelectedInvoices) => {
        const newState = [...prevSelectedInvoices];

        newState[selectedInvoice.index].status = 'a';
        if (newState.length - 1 === selectedInvoice.index) {
          setSelectedInvoice({
            ...selectedInvoice,
            status: 'a',
          });
          form.setValue('approval_status', 'a');
          return newState;
        }

        setSelectedInvoice({
          ...newState[selectedInvoice.index + 1],
          index: selectedInvoice.index + 1,
        });
        getInvoiceViewData(
          newState[selectedInvoice.index + 1]?.invoiceId,
          form,
          [],
          setLoading,
          setErrorStatus,
          setInvoiceType,
        );

        return newState;
      });
  };

  const rejectInvoiceHandler = () => {
    setSelectedInvoices &&
      setSelectedInvoices((prevSelectedInvoices) => {
        const newState = [...prevSelectedInvoices];
        newState[selectedInvoice.index].status = 'r';
        if (newState.length - 1 === selectedInvoice.index) {
          setSelectedInvoice({
            ...selectedInvoice,
            status: 'r',
          });
          form.setValue('approval_status', 'r');
          return newState;
        }

        setSelectedInvoice({
          ...newState[selectedInvoice.index + 1],
          index: selectedInvoice.index + 1,
        });
        getInvoiceViewData(
          newState[selectedInvoice.index + 1]?.invoiceId,
          form,
          [],
          setLoading,
          setErrorStatus,
          setInvoiceType,
        );

        return newState;
      });
  };

  const approveInvoice = async () => {
    try {
      if (!form.getValues('type')) {
        setContractValidationModal(true);
      } else {
        setApproving(true);
        await approveInvoiceRequest(
          getCookie('token'),
          [selectedInvoice?.invoiceId],
          form.getValues('type') as 'invoice' | 'revenue',
        );
        if (form.getValues('type') === 'invoice') {
          setContractQuestionModal(true);
          setSelectedInvoices &&
            setSelectedInvoices((prevSelectedInvoices) => {
              const newState = [...prevSelectedInvoices];
              newState[selectedInvoice.index].status = 'a';
              setSelectedInvoice({
                ...selectedInvoice,
                status: 'a',
              });
              form.setValue('approval_status', 'a');
              return newState;
            });
          return;
        } else {
          approveInvoiceHandler();
        }
      }
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setApproving(false);
    }
  };

  const rejectInvoice = async () => {
    try {
      setRejecting(true);
      await rejectInvoiceRequest(
        getCookie('token'),
        [selectedInvoice?.invoiceId],
        form.getValues('type') as 'invoice' | 'revenue',
      );
      if (form.getValues('type') === 'invoice') {
        setSelectedInvoices &&
          setSelectedInvoices((prevSelectedInvoices) => {
            const newState = [...prevSelectedInvoices];
            newState[selectedInvoice.index].status = 'r';
            setSelectedInvoice({
              ...selectedInvoice,
              status: 'r',
            });
            form.setValue('approval_status', 'r');
            return newState;
          });
      } else {
        rejectInvoiceHandler();
      }
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setRejecting(false);
    }
  };

  const prevInvoice = () => {
    setSelectedInvoice((prev) => {
      const nextInvoice = selectedInvoices[prev.index - 1];
      getInvoiceViewData(
        nextInvoice.invoiceId,
        form,
        [],
        setLoading,
        setErrorStatus,
        setInvoiceType,
      );
      return {
        ...nextInvoice,
        index: prev.index - 1,
      };
    });
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
  };

  return {
    form,
    formatter,
    nextInvoice,
    prevInvoice,
    selectedInvoice,
    loading,
    currentPage,
    approveInvoice,
    rejectInvoice,
    approving,
    rejecting,
    setLoading,
    errorStatus,
    closeHandler,
    contractQuestionModal,
    setContractQuestionModal,
    contractValidationModal,
    setContractValidationModal,
    invoiceType,
    changeStatusSubmitHandler,
    changingStatus,
    changeStatusLoading,
    changingPartiallyPaid,
    setChangingStatus,
    approveInvoiceHandler,
  };
};
