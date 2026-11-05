import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { handleBackendErrors, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { invoiceEmailSettingsSchema, InvoiceEmailSettingsFormValues } from 'schemas';
import { updateInvoiceEmailSettings } from 'services';
import { InvoiceEmailSettings } from 'types';

const appPasswordPattern = /^[a-zA-Z0-9]{16}$/;

const getDefaultValues = (settings: InvoiceEmailSettings): InvoiceEmailSettingsFormValues => ({
  from_email: settings.from_email ?? '',
  smtp_app_password: '',
  to_recipients: settings.to_recipients,
  cc_recipients: settings.cc_recipients,
  bcc_recipients: settings.bcc_recipients,
  initial_subject: settings.initial_subject ?? '',
  initial_body: settings.initial_body ?? '',
  follow_up_1_body: settings.follow_up_1_body ?? '',
  follow_up_2_body: settings.follow_up_2_body ?? '',
});

const normalizeEmail = (email: string | null): string => email?.trim().toLowerCase() ?? '';

export const useInvoiceEmailSettingsForm = (settings: InvoiceEmailSettings) => {
  const [smtpConfigured, setSmtpConfigured] = useState(settings.smtp_configured);
  const [isReplacingAppPassword, setIsReplacingAppPassword] = useState(!settings.smtp_configured);
  const form = useForm<InvoiceEmailSettingsFormValues>({
    resolver: zodResolver(invoiceEmailSettingsSchema),
    defaultValues: getDefaultValues(settings),
  });
  const fromEmail = form.watch('from_email');
  const persistedFromEmail = form.formState.defaultValues?.from_email;
  const senderChanged = normalizeEmail(fromEmail) !== normalizeEmail(persistedFromEmail ?? null);
  const needsAppPassword = !smtpConfigured || isReplacingAppPassword || senderChanged;

  const startReplacingAppPassword = () => {
    setIsReplacingAppPassword(true);
  };

  const cancelReplacingAppPassword = () => {
    form.resetField('smtp_app_password');
    setIsReplacingAppPassword(false);
  };

  const onSubmit = async (values: InvoiceEmailSettingsFormValues) => {
    if (needsAppPassword && !appPasswordPattern.test(values.smtp_app_password)) {
      form.setError('smtp_app_password', {
        type: 'manual',
        message: 'Enter the 16-character Google app password.',
      });
      return;
    }

    try {
      const savedSettings = await updateInvoiceEmailSettings(getCookie('token'), {
        ...values,
        smtp_app_password: needsAppPassword ? values.smtp_app_password : '',
      });

      setSmtpConfigured(savedSettings.smtp_configured);
      setIsReplacingAppPassword(false);
      form.reset(getDefaultValues(savedSettings));
    } catch (error: any) {
      const errors = error?.response?.data?.errors;

      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error);
      }
    }
  };

  const reset = () => {
    form.reset();
    setIsReplacingAppPassword(!smtpConfigured);
  };

  return {
    form,
    onSubmit,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    reset,
    smtpConfigured,
    needsAppPassword,
    isReplacingAppPassword,
    startReplacingAppPassword,
    cancelReplacingAppPassword,
  };
};
