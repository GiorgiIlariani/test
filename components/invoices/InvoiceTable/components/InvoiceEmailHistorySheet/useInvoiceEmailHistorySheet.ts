import { toast } from 'components';
import { getCookie } from 'cookies-next';
import { binFileDownloadHandler, toastGeneralError } from 'helpers';
import { useState } from 'react';
import {
  downloadInvoiceEmailAttachment,
  getInvoiceEmailHistory,
  retryInvoiceEmailFollowUp,
} from 'services';
import { InvoiceEmailEvent } from 'types';

export const useInvoiceEmailHistorySheet = (invoiceId: number) => {
  const [events, setEvents] = useState<InvoiceEmailEvent[]>();
  const [loading, setLoading] = useState(false);
  const [downloadingEventId, setDownloadingEventId] = useState<number | null>(null);
  const [retryingEventId, setRetryingEventId] = useState<number | null>(null);

  const loadHistory = async () => {
    setLoading(true);

    try {
      setEvents(await getInvoiceEmailHistory(getCookie('token'), invoiceId));
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAttachment = async (event: InvoiceEmailEvent) => {
    if (!event.attachment_name || downloadingEventId !== null) return;

    setDownloadingEventId(event.id);
    try {
      await binFileDownloadHandler(
        () => downloadInvoiceEmailAttachment(getCookie('token'), invoiceId, event.id),
        event.attachment_name,
        () => {
          toast.add({
            title: 'Download failed',
            description: 'The invoice PDF could not be downloaded. Please try again.',
            type: 'error',
            priority: 'high',
          });
        },
      );
    } finally {
      setDownloadingEventId(null);
    }
  };

  const retryFollowUp = async (event: InvoiceEmailEvent) => {
    if (retryingEventId !== null) return;

    setRetryingEventId(event.id);
    try {
      const response = await retryInvoiceEmailFollowUp(getCookie('token'), invoiceId, event.id);
      await loadHistory();
      toast.add({
        title: 'Follow-up queued',
        description: response.message,
        type: 'success',
      });
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setRetryingEventId(null);
    }
  };

  return {
    loadHistory,
    events,
    loading,
    downloadAttachment,
    downloadingEventId,
    retryFollowUp,
    retryingEventId,
  };
};
