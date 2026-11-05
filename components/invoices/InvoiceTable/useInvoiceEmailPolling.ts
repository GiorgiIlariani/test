'use client';

import { isAxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { useCallback, useEffect, useRef } from 'react';
import { getInvoiceEmailStatus } from 'services';
import { toast } from 'components';
import type { InvoiceEmailEventState } from 'types';
import type { Props } from './types';

const POLLING_INTERVAL_MS = 5000;
const VISIBILITY_DEBOUNCE_MS = 200;
const MAX_POLLING_ATTEMPTS = 60;

const waitForNextPollingAttempt = (signal: AbortSignal) =>
  new Promise<boolean>((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const finish = (shouldPoll: boolean) => {
      if (timeoutId) clearTimeout(timeoutId);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      signal.removeEventListener('abort', handleAbort);
      resolve(shouldPoll);
    };

    const clearPollingTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const schedulePollingAttempt = (delay: number) => {
      clearPollingTimeout();
      timeoutId = setTimeout(() => finish(!document.hidden), delay);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearPollingTimeout();
        return;
      }

      schedulePollingAttempt(VISIBILITY_DEBOUNCE_MS);
    };

    const handleAbort = () => finish(false);

    if (signal.aborted) {
      resolve(false);
      return;
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    signal.addEventListener('abort', handleAbort, { once: true });

    if (!document.hidden) {
      schedulePollingAttempt(POLLING_INTERVAL_MS);
    }
  });

const isRetryablePollingError = (error: unknown) => {
  if (!isAxiosError(error)) return false;

  const status = error.response?.status;

  return !status || status === 408 || status === 429 || status >= 500;
};

const updateInvoiceEmailStatus = (
  invoices: Props['invoiceData'],
  invoiceId: number,
  event: InvoiceEmailEventState,
) =>
  invoices.map((invoice) =>
    invoice.id === invoiceId && invoice.latest_initial_email_event?.id === event.id
      ? {
          ...invoice,
          latest_initial_email_event: {
            id: event.id,
            status: event.status,
            created_at: event.created_at,
          },
          email_sent_at: event.sent_at ?? invoice.email_sent_at,
        }
      : invoice,
  );

const markInvoiceEmailAsPending = (
  invoices: Props['invoiceData'],
  invoiceId: number,
  eventId: number,
) =>
  invoices.map((invoice) =>
    invoice.id === invoiceId
      ? {
          ...invoice,
          latest_initial_email_event: {
            id: eventId,
            status: 'pending' as const,
            created_at: new Date().toISOString(),
          },
          email_events_count: (invoice.email_events_count ?? 0) + 1,
        }
      : invoice,
  );

const showDeliveryFailure = (event: InvoiceEmailEventState) => {
  if (event.status !== 'failed') return;

  toast.add({
    id: `invoice-email-failed-${event.id}`,
    title: 'Invoice email failed',
    description: event.failure_reason ?? 'The invoice email could not be sent. Please try again.',
    type: 'error',
  });
};

const showPollingError = (eventId: number, retryable: boolean) => {
  const message = retryable
    ? 'Unable to refresh invoice email status. Retrying...'
    : 'Unable to refresh invoice email status. Please refresh the page.';

  toast.add({
    id: `invoice-email-polling-${retryable ? 'error' : 'stopped'}-${eventId}`,
    title: 'Invoice email',
    description: message,
    type: retryable ? 'warning' : 'error',
  });
};

const showPollingTimeout = (eventId: number) => {
  toast.add({
    id: `invoice-email-polling-timeout-${eventId}`,
    title: 'Invoice email',
    description: 'Invoice email delivery is still processing. Refresh later.',
    type: 'info',
  });
};

const getPendingInvoiceEvents = (invoices: Props['invoiceData']) =>
  invoices.flatMap((invoice) => {
    const event = invoice.latest_initial_email_event;

    return event?.status === 'pending' ? [{ invoiceId: invoice.id, eventId: event.id }] : [];
  });

export const useInvoiceEmailPolling = (
  invoiceData: Props['invoiceData'],
  setInvoiceData: Props['setInvoiceData'],
) => {
  const pollingControllers = useRef(new Map<number, AbortController>());
  const stoppedEvents = useRef(new Set<number>());

  const pollInvoiceEmail = useCallback(
    async (invoiceId: number, eventId: number) => {
      if (pollingControllers.current.has(eventId) || stoppedEvents.current.has(eventId)) return;

      const controller = new AbortController();
      pollingControllers.current.set(eventId, controller);

      let attempt = 0;
      let hasShownRetryWarning = false;

      try {
        while (attempt < MAX_POLLING_ATTEMPTS && !controller.signal.aborted) {
          if (!(await waitForNextPollingAttempt(controller.signal))) continue;

          attempt += 1;

          try {
            const event = await getInvoiceEmailStatus(
              getCookie('token'),
              invoiceId,
              eventId,
              controller.signal,
            );

            if (controller.signal.aborted) return;
            if (event.status === 'pending') continue;

            setInvoiceData((current) => updateInvoiceEmailStatus(current, invoiceId, event));
            showDeliveryFailure(event);

            return;
          } catch (error) {
            if (controller.signal.aborted) return;

            const isRetryable = isRetryablePollingError(error);

            if (!isRetryable || !hasShownRetryWarning) {
              showPollingError(eventId, isRetryable);
            }

            if (!isRetryable) {
              stoppedEvents.current.add(eventId);
              return;
            }

            hasShownRetryWarning = true;
          }
        }

        if (!controller.signal.aborted) {
          stoppedEvents.current.add(eventId);
          showPollingTimeout(eventId);
        }
      } finally {
        if (pollingControllers.current.get(eventId) === controller) {
          pollingControllers.current.delete(eventId);
        }
      }
    },
    [setInvoiceData],
  );

  const invoiceEmailQueuedHandler = (invoiceId: number, eventId: number) => {
    stoppedEvents.current.delete(eventId);
    setInvoiceData((current) => markInvoiceEmailAsPending(current, invoiceId, eventId));

    void pollInvoiceEmail(invoiceId, eventId);
  };

  useEffect(() => {
    const pendingEvents = getPendingInvoiceEvents(invoiceData);
    const visiblePendingEventIds = new Set(pendingEvents.map(({ eventId }) => eventId));

    pollingControllers.current.forEach((controller, eventId) => {
      if (!visiblePendingEventIds.has(eventId)) {
        pollingControllers.current.delete(eventId);
        controller.abort();
      }
    });

    pendingEvents.forEach(({ invoiceId, eventId }) => {
      void pollInvoiceEmail(invoiceId, eventId);
    });
  }, [invoiceData, pollInvoiceEmail]);

  useEffect(() => {
    const controllers = pollingControllers.current;

    function stopPollingOnUnmount() {
      controllers.forEach((controller) => controller.abort());
    }

    return stopPollingOnUnmount;
  }, []);

  return { invoiceEmailQueuedHandler };
};
