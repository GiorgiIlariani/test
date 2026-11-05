import { axios } from 'services';
import { CookieValueTypes } from 'cookies-next';
import {
  ApprovalStatus,
  CreateInvoice,
  FilterOptionsForApi,
  Invoice,
  InvoiceCalculationResponse,
  InvoiceDashboard,
  InvoiceEmailEventState,
  InvoiceEmailPayload,
  InvoiceEmailDetails,
  InvoiceEmailEvent,
  InvoiceResponse,
  InvoiceTypes,
  PaidStatus,
} from 'types';
import { AxiosResponse } from 'axios';

export const getInvoices = async (
  token: CookieValueTypes | string,
  pageIndex: number | string,
  pages: number,
  filterOptions?: FilterOptionsForApi[],
): Promise<InvoiceDashboard> => {
  const res = await axios.post(
    `/invoices?page=${pageIndex}`,
    {
      filter_options: filterOptions,
      invoices_per_page: pages,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getProjectInvoices = async (
  token: CookieValueTypes | string,
  pageIndex: string,
  projectId: number,
  perPage: number = 10,
): Promise<InvoiceDashboard> => {
  const res = await axios.post(
    `/invoices`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: pageIndex,
        projectId: projectId,
        invoices_per_page: perPage,
      },
    },
  );
  return res.data;
};

export const createInvoiceRequest = async (
  token: CookieValueTypes | string,
  invoice: CreateInvoice,
) => {
  const res = await axios.post('/invoices-create', invoice, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getInvoiceCalculationRequest = async (
  token: CookieValueTypes | string,
  id: string | number,
  data: {
    start_date: string;
    end_date: string;
    type: InvoiceTypes;
  },
): Promise<InvoiceCalculationResponse> => {
  const res = await axios.post(`/invoice-calculations/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getInvoiceVacationRequest = async (
  token: CookieValueTypes | string,
  id: string | number,
  data: {
    previous_scope_start_date: string;
    previous_scope_end_date: string;
  },
): Promise<CreateInvoice['vacations']> => {
  const res = await axios.post(`/invoice-vacation-calculations/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const editInvoicePaidStatus = async (
  token: CookieValueTypes | string,
  data: { payment_status: string; partially_paid_amount?: number | string },
  invoiceId: number,
): Promise<string> => {
  const res = await axios.patch(`/invoices/${invoiceId}/payment-status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const editInvoiceApprovalStatus = async (
  token: CookieValueTypes | string,
  approval_status: ApprovalStatus,
  invoiceId: number,
): Promise<string> => {
  const res = await axios.patch(
    `/invoices/${invoiceId}/approval-status`,
    { approval_status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getInvoiceInfoRequest = async (
  token: CookieValueTypes | string,
  id: number,
): Promise<InvoiceResponse> => {
  const res = await axios.get(`/invoices/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const approveInvoiceRequest = async (
  token: CookieValueTypes | string,
  ids: number[],
  type?: 'revenue' | 'invoice',
): Promise<string> => {
  const res = await axios.patch(
    `/invoices/approve?ids=${ids}`,
    { type, ids },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

export const rejectInvoiceRequest = async (
  token: CookieValueTypes | string,
  ids: number[],
  type?: 'revenue' | 'invoice',
): Promise<string> => {
  const res = await axios.patch(
    `/invoices/reject`,
    { type },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ids: ids,
      },
    },
  );
  return res.data;
};

export const deleteInvoices = async (
  token: CookieValueTypes | string,
  ids: number[],
): Promise<string> => {
  const res = await axios.delete(`/invoices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      ids,
    },
  });
  return res.data;
};

export const generateInvoicePdf = async (
  token: CookieValueTypes | string,
  ids: number[],
  language: 'en' | 'ka' = 'en',
): Promise<AxiosResponse<File, any>> => {
  const generateParams = ids.map((id, i) => `ids[${i}]=${id}`).join('&');
  const res = await axios.get(`/invoices/generate-pdf?${generateParams}&language=${language}`, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/zip',
      'Content-Disposition': 'attachment',
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const generateInvoiceCsv = async (
  token: CookieValueTypes | string,
  ids: number[],
): Promise<AxiosResponse<File, any>> => {
  const generateParams = ids.map((id, i) => `ids[${i}]=${id}`).join('&');
  const res = await axios.get(`/invoices/generate-csv?${generateParams}`, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/zip',
      'Content-Disposition': 'attachment',
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const patchInvoiceRequest = async (
  id: number,
  data: Invoice,
  token: CookieValueTypes | string,
) => {
  const res = await axios.patch(`/invoices/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const selectAllInvoicesRequest = async (
  filterOptions: FilterOptionsForApi[] = [],
  token: CookieValueTypes,
): Promise<
  {
    id: number;
    approval_status: ApprovalStatus;
    payment_status: PaidStatus;
  }[]
> => {
  const res = await axios.post(
    '/select-all-invoices',
    {
      filter_options: filterOptions,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getInvoiceEmailDetails = async (
  token: CookieValueTypes | string,
  invoiceId: number,
  signal?: AbortSignal,
): Promise<InvoiceEmailDetails> => {
  const res = await axios.get(`/invoices/${invoiceId}/email-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return res.data;
};

export const sendInvoiceEmail = async (
  token: CookieValueTypes | string,
  invoiceId: number,
  payload: InvoiceEmailPayload,
): Promise<{ message: string; email_event_id: number }> => {
  const res = await axios.post(`/invoices/${invoiceId}/emails`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getInvoiceEmailStatus = async (
  token: CookieValueTypes | string,
  invoiceId: number,
  eventId: number,
  signal?: AbortSignal,
): Promise<InvoiceEmailEventState> => {
  const res = await axios.get(`/invoices/${invoiceId}/emails/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
    timeout: 10_000,
  });

  return res.data;
};

export const getInvoiceEmailHistory = async (
  token: CookieValueTypes | string,
  invoiceId: number,
  signal?: AbortSignal,
): Promise<InvoiceEmailEvent[]> => {
  const res = await axios.get(`/invoices/${invoiceId}/emails`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return res.data;
};

export const downloadInvoiceEmailAttachment = async (
  token: CookieValueTypes | string,
  invoiceId: number,
  eventId: number,
): Promise<Blob> => {
  const res = await axios.get(`/invoices/${invoiceId}/emails/${eventId}/attachment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });

  return res.data;
};

export const retryInvoiceEmailFollowUp = async (
  token: CookieValueTypes | string,
  invoiceId: number,
  eventId: number,
): Promise<{ message: string; email_event_id: number }> => {
  const res = await axios.post(
    `/invoices/${invoiceId}/emails/${eventId}/retry`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getVats = async (
  token: CookieValueTypes | string,
): Promise<{ id: number; value: number; name: string }[]> => {
  const res = await axios.get(`/vats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
