'use client';

import { getCookie } from 'cookies-next';
import { can, generateInvoiceCSV, generateInvoicePDF, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { deleteInvoices, editInvoicePaidStatus, getInvoices, getProjectInvoices } from 'services';
import {
  ApprovalStatus,
  Currency,
  FilterOptions,
  InvoiceDashboard,
  InvoiceList,
  InvoiceTypes,
  PaidStatus,
  Permission,
  SelectedInvoices,
  SetState,
} from 'types';
import { Props } from './types';

export const useInvoicesSection = (
  permissions: Permission[],
  projectInvoices: boolean,
  setLoading: SetState<boolean>,
  currency: Currency,
  invoices?: InvoiceDashboard | undefined,
  projectId?: number,
  refetchInvoices?: (
    filterOptionsArg?: FilterOptions[],
    page?: number,
    pages?: number,
  ) => Promise<InvoiceDashboard | undefined>,
  invoiceCreated?: boolean,
  projects?: Props['projects'],
) => {
  const router = useRouter();
  const invoicesTab = router.query?.project && router.query?.project[1] === 'invoices';
  const isInvoicePage = router.pathname === '/invoices';
  const [invoiceData, setInvoiceData] = useState<InvoiceList[]>(invoices?.data ?? []);
  const [invoicePage, setInvoicePage] = useState<InvoiceDashboard>();
  const [selectedInvoices, setSelectedInvoices] = useState<SelectedInvoices[]>([]);
  const [approvedInvoices, setApprovedInvoices] = useState(false);
  const [rejectedInvoices, setRejectedInvoices] = useState(false);
  const [partiallyIsOpen, setPartiallyIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [partiallyOpenId, setPartiallyOpenId] = useState<number>();
  const [modalCurrency, setModalCurrency] = useState<Currency>('USD');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [invoiceTotal, setInvoiceTotal] = useState<number>();
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
  const [paidStatusChanged, setPaidStatusChanged] = useState(false);
  const [contractAssetIsOpen, setContractAssetIsOpen] = useState(false);
  const [invoiceUpdated, setInvoiceUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(router.query.page ? +router.query.page : 1);
  const [reviewingInvoiceData, setReviewingInvoiceData] = useState<{
    currency: Currency;
    internal_project_id: number;
    project_name: string;
  }>({ currency: 'USD', internal_project_id: 0, project_name: '' });
  const [invoicesIsOpen, setInvoicesIsOpen] = useState<InvoiceTypes | undefined>();
  const [creatingInvoiceProjectData, setCreatingInvoiceProjectData] = useState<{
    currency: Currency;
    internal_project_id: number;
    project_name: string;
  }>({ currency: 'USD', internal_project_id: 0, project_name: '' });

  const getInvoiceData = async () => {
    try {
      if (projectInvoices) {
        setLoading(true);
        const response = await getProjectInvoices(
          getCookie('token'),
          currentPage.toString(),
          projectId!,
        );
        setInvoiceData(response.data);
        setInvoiceTotal(response?.total);
        setInvoicePage(response);
        setLoading(false);
      } else {
        setInvoiceData(invoices?.data ?? []);
        setInvoiceTotal(invoices?.total);
        setInvoicePage(invoices);
      }
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    getInvoiceData();
  }, [projectId, projectInvoices, invoices, invoiceCreated, invoiceUpdated]);

  useEffect(() => {
    setCurrentPage(router.query.page ? +router.query.page : 1);
  }, [router]);

  const checkIfInvoiceIsApproved = useCallback(() => {
    if (selectedInvoices.length !== 0) {
      if (
        selectedInvoices.filter((invoice) => invoice.status.includes('a')).length ===
        selectedInvoices.length
      ) {
        setApprovedInvoices(true);
      } else {
        setApprovedInvoices(false);
      }
    } else {
      setApprovedInvoices(false);
    }
  }, [selectedInvoices]);

  const checkIfInvoiceIsRejected = useCallback(() => {
    const selectedPaidStatus = selectedInvoices.map((invoice) => invoice.paid_status);
    if (selectedPaidStatus.includes('pp')) {
      setRejectedInvoices(true);
      return;
    }
    if (selectedInvoices.length !== 0) {
      if (
        selectedInvoices.filter((invoice) => invoice.status.includes('r')).length ===
        selectedInvoices.length
      ) {
        setRejectedInvoices(true);
      } else {
        setRejectedInvoices(false);
      }
    } else {
      setRejectedInvoices(false);
    }
  }, [selectedInvoices]);

  useEffect(() => {
    checkIfInvoiceIsApproved();
    checkIfInvoiceIsRejected();
  }, [
    checkIfInvoiceIsApproved,
    checkIfInvoiceIsRejected,
    selectedInvoices.length,
    invoiceData,
    selectedInvoices,
    paidStatusChanged,
  ]);

  const calculateTotalHandler = (
    amount: 'total' | 'discount_amount' | 'free_of_charge' | 'total_to_be_paid',
  ) => {
    const newData = invoiceData
      ?.map((invoice) => Math.round(+invoice[amount]?.[currency]!))
      .reduce((a, b) => a + b, 0);

    return `${newData?.toLocaleString()}`;
  };

  const selectInvoiceHandler = (
    invoiceId: number,
    i: number,
    status: ApprovalStatus,
    paid_status: PaidStatus | null,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedInvoices((prevState) => [...prevState, { invoiceId, status, paid_status }]);
    } else {
      setSelectedInvoices((prevState) => {
        const newState = prevState.filter((invoice) => invoice.invoiceId !== invoiceId);
        return newState;
      });
    }
  };

  const refetchProjectInvoices = async (page: number = +currentPage, per_page: number) => {
    setLoading(true);
    try {
      const fetchedInvoices = await getProjectInvoices(
        getCookie('token'),
        page.toString(),
        Number(router.query?.project?.[0]) ?? 1,
        per_page,
      );
      setCurrentPage(page);
      setInvoiceData(fetchedInvoices.data);
      setInvoiceTotal(fetchedInvoices.total);
      setInvoicePage(fetchedInvoices);
      return fetchedInvoices;
    } catch (error: any) {
      error.response?.status && toastGeneralError(error, router);
    } finally {
      setLoading(false);
    }
  };

  const selectAllInvoicesHandler = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices((prevState) => {
        const newState = [
          ...prevState,
          ...invoiceData?.map((invoice) => ({
            invoiceId: invoice.id,
            status: invoice.approval_status,
            paid_status: invoice.payment_status,
          })),
        ];
        return newState.filter(
          (invoice, index, arr) =>
            arr.findIndex((existing) => existing.invoiceId === invoice.invoiceId) === index,
        );
      });
    } else {
      setSelectedInvoices([]);
    }
  };

  const openPartiallyPaidHandler = (invoiceId: number, currency: Currency) => {
    setInputValue('');
    setModalCurrency(currency);
    setPartiallyOpenId(invoiceId as number);
    setPartiallyIsOpen(true);
  };

  const cancelPartiallyPaidHandler = () => {
    setPartiallyIsOpen(false);
    setInputValue('');
  };

  const addPartiallyPaidAmount = async () => {
    const partiallyPaidAmount = +inputValue.replaceAll(',', '');
    try {
      const data = {
        payment_status: 'pp',
        partially_paid_amount: partiallyPaidAmount,
      };

      setPartiallyIsOpen(false);

      await editInvoicePaidStatus(getCookie('token'), data, partiallyOpenId as number);

      setInvoiceData((prevState: InvoiceList[]) => {
        return prevState.map((invoice: InvoiceList) =>
          invoice.id === partiallyOpenId
            ? {
                ...invoice,
                payment_status: 'pp',
                partially_paid_amount: partiallyPaidAmount,
              }
            : invoice,
        );
      });

      setSelectedInvoices((prevState) =>
        prevState.map((invoice) =>
          invoice.invoiceId === partiallyOpenId ? { ...invoice, paid_status: 'pp' } : invoice,
        ),
      );
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const deleteBulkInvoices = async () => {
    try {
      const selectedInvoiceId = selectedInvoices.map((invoiceData) => invoiceData.invoiceId);
      await deleteInvoices(getCookie('token'), selectedInvoiceId);
      setDeleteDialog(false);
      setSelectedInvoices([]);
      if (selectedInvoices.length === invoiceData.length) {
        if (Number(currentPage) === 1) {
          if (!projectInvoices) {
            router.push(`/invoices?page=${Number(currentPage)}`);
          } else {
            router.push(`/projects/${projectId}/invoices?page=${Number(currentPage)}`);
          }
        } else if (invoicePage?.last_page !== 1) {
          if (!projectInvoices) {
            router.push(`/invoices?page=${Number(currentPage) - 1}`);
          } else {
            router.push(`/projects/${projectId}/invoices?page=${Number(currentPage) - 1}`);
          }
        }
      } else {
        updateInvoicesList(currentPage.toString());
      }
      if (projectInvoices) {
        refetchProjectInvoices(currentPage, 10);
      }
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const reviewButtonHandler = () => {
    let grantAccess: string[] = [];

    if (can('project-invoice::review', permissions)) {
      !grantAccess.includes('canReview') && grantAccess.push('canReview');
    }

    !grantAccess.includes('reviewIsActive') && grantAccess.push('reviewIsActive');

    return grantAccess;
  };

  const generateInvoice = async (isPdf: boolean, language: 'en' | 'ka' = 'en') => {
    try {
      const selectedInvoiceId = selectedInvoices.map((invoiceData) => invoiceData.invoiceId);
      if (isPdf) {
        generateInvoicePDF(
          selectedInvoiceId,
          () => {},
          true,
          language,
          selectedInvoiceId.length === 1
            ? invoiceData?.find((invoice) => selectedInvoiceId.includes(invoice.id))?.generated_id
            : '',
        );
      } else {
        generateInvoiceCSV(
          selectedInvoiceId,
          () => {},
          true,
          selectedInvoiceId.length === 1
            ? invoiceData?.find((invoice) => selectedInvoiceId.includes(invoice.id))?.generated_id
            : '',
        );
      }
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const openReviewModal = () => {
    setReviewModalIsOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalIsOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('reviewing');
    url.searchParams.delete('invoice_id');
    window.history.replaceState({ path: url.href }, '', url.href);
  };

  const updateInvoicesList = async (page?: string, pages: number = 10) => {
    try {
      setLoading(true);
      let res;
      if (!projectId) {
        res =
          (await refetchInvoices?.(undefined)) ??
          (await getInvoices(getCookie('token'), page ?? currentPage, pages));
        setCurrentPage((prev) => (page ? +page : prev));
        setInvoiceTotal(res.total);
        setInvoiceData(res.data);
      } else {
        res = await getProjectInvoices(
          getCookie('token'),
          page ?? currentPage.toString(),
          +projectId,
          pages ?? 10,
        );
        setCurrentPage((prev) => (page ? +page : prev));
        setInvoiceTotal(res.total);
        setInvoiceData(res.data);
      }
    } catch (error) {
      toastGeneralError(error, router);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.invoice_id && !!router.query.reviewing) {
      setSelectedInvoices([
        {
          invoiceId: +router.query.invoice_id!,
          paid_status: 'p',
          status: 'p',
        },
      ]);
      openReviewModal();
    }
  }, []);

  const setProjectToCreateInvoiceOn = (projectId: number) => {
    const projectState = projects?.find((project) => Number(project.id) === projectId);

    if (!projectState) return;

    setCreatingInvoiceProjectData({
      currency: projectState?.currency ?? 'USD',
      internal_project_id: projectState?.id,
      project_name: projectState?.title as string,
    });
  };

  return {
    calculateTotalHandler,
    selectInvoiceHandler,
    selectedInvoices,
    selectAllInvoicesHandler,
    router,
    approvedInvoices,
    rejectedInvoices,
    invoiceData,
    setInvoiceData,
    partiallyIsOpen,
    openPartiallyPaidHandler,
    setPartiallyIsOpen,
    cancelPartiallyPaidHandler,
    inputValue,
    setInputValue,
    addPartiallyPaidAmount,
    partiallyOpenId,
    modalCurrency,
    deleteDialog,
    setDeleteDialog,
    deleteBulkInvoices,
    invoiceTotal,
    setInvoiceTotal,
    invoicesTab,
    reviewButtonHandler,
    generateInvoice,
    openReviewModal,
    closeReviewModal,
    reviewModalIsOpen,
    setPaidStatusChanged,
    setSelectedInvoices,
    updateInvoicesList,
    contractAssetIsOpen,
    setContractAssetIsOpen,
    reviewingInvoiceData,
    setReviewingInvoiceData,
    setReviewModalIsOpen,
    currentPage,
    setCurrentPage,
    invoicePage,
    isInvoicePage,
    refetchProjectInvoices,
    setInvoiceUpdated,
    invoicesIsOpen,
    setInvoicesIsOpen,
    setProjectToCreateInvoiceOn,
    creatingInvoiceProjectData,
    setCreatingInvoiceProjectData,
  };
};
