import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getInvoiceEmailDetails, sendInvoiceEmail } from 'services';
import type { InvoiceEmailDetails } from 'types';
import { type InvoiceSendEmailSchemaValues, invoiceSendEmailSchema } from 'schemas';

const getDefaultValues = (emailDetails?: InvoiceEmailDetails): InvoiceSendEmailSchemaValues => ({
  to_recipients: emailDetails?.to_recipients ?? [],
  cc_recipients: emailDetails?.cc_recipients ?? [],
  bcc_recipients: emailDetails?.bcc_recipients ?? [],
  subject: emailDetails?.subject ?? '',
  body: emailDetails?.body ?? '',
  language: emailDetails?.language ?? 'en',
});

export const useSendEmailInvoiceModal = (
  invoiceId: number,
  isResend: boolean,
  onClose: () => void,
  onQueued: (eventId: number) => void,
) => {
  const [emailDetails, setEmailDetails] = useState<InvoiceEmailDetails>();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<InvoiceSendEmailSchemaValues>({
    resolver: zodResolver(invoiceSendEmailSchema),
    defaultValues: getDefaultValues(),
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    const abortController = new AbortController();

    const loadEmailDetails = async () => {
      setIsLoading(true);

      try {
        const loadedEmailDetails = await getInvoiceEmailDetails(
          getCookie('token'),
          invoiceId,
          abortController.signal,
        );

        setEmailDetails(loadedEmailDetails);
        reset(getDefaultValues(loadedEmailDetails));
        setIsLoading(false);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        toastGeneralError(error);
        onClose();
      }
    };

    void loadEmailDetails();

    return () => {
      abortController.abort();
    };
  }, [invoiceId, onClose, reset]);

  const onSubmit = async (data: InvoiceSendEmailSchemaValues) => {
    try {
      const response = await sendInvoiceEmail(getCookie('token'), invoiceId, {
        ...data,
        resend: isResend,
      });

      onQueued(response.email_event_id);
      onClose();
    } catch (error: any) {
      const errors = error?.response?.data?.errors;

      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error);
      }
    }
  };

  const senderMissing = !isLoading && !emailDetails?.smtp_configured;
  const language = form.watch('language');

  return { isLoading, isSubmitting, senderMissing, form, onSubmit, emailDetails, language };
};
