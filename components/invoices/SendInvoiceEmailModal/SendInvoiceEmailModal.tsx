import Link from 'next/link';
import { FormProvider } from 'react-hook-form';
import { PaperclipIcon, TriangleAlertIcon } from 'lucide-react';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FormTagsInput,
  FormSelect,
  Input,
  InvoiceEmailVariableField,
  Loader,
  Modal,
} from 'components';
import { SendInvoiceEmailModalProps } from './types';
import { useSendEmailInvoiceModal } from './useSendInvoiceEmailModal';

const SendInvoiceEmailModal: React.FC<SendInvoiceEmailModalProps> = ({
  invoiceId,
  isResend,
  clientName,
  onClose,
  onQueued,
}) => {
  const { isLoading, isSubmitting, senderMissing, form, onSubmit, emailDetails, language } =
    useSendEmailInvoiceModal(invoiceId, isResend, onClose, onQueued);

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={isResend ? `Resend invoice to ${clientName}` : `Send invoice to ${clientName}`}
      loading={isLoading}
      submitting={isSubmitting}
      closeButtonText='Cancel'
      confirmButtonText={isResend ? 'Resend email' : 'Send email'}
      confirmButtonTextSubmitting={isResend ? 'Resending...' : 'Sending...'}
      confirmButtonDisabled={senderMissing}
      onConfirm={form.handleSubmit(onSubmit)}
    >
      <FormProvider {...form}>
        <div className='flex flex-col gap-5'>
          {isResend && !isLoading && (
            <div className='flex gap-1 rounded-md text-warning border border-warning/50 bg-warning/10 p-3 text-sm'>
              <TriangleAlertIcon size={16} className='shrink-0 mt-0.5' />
              <p>This invoice was already sent. Resending will email the client another copy.</p>
            </div>
          )}

          {isLoading ? (
            <div className='flex min-h-72 items-center justify-center'>
              <Loader size='28px' border='3px' />
            </div>
          ) : (
            <FieldSet disabled={isSubmitting}>
              <FieldGroup>
                <Field>
                  <FieldLabel>
                    From <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Input
                    value={emailDetails?.from_email ?? ''}
                    placeholder='No sender configured'
                    disabled={true}
                    readOnly
                  />
                  {senderMissing && (
                    <FieldError>
                      Configure a sender address in{' '}
                      <Link
                        href='/settings/invoice-emails'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-medium text-primary underline'
                      >
                        Invoice Email settings
                      </Link>
                      .
                    </FieldError>
                  )}
                </Field>

                <FormTagsInput
                  type='email'
                  name='to_recipients'
                  label='To'
                  description='Separate addresses with Enter, comma, or semicolon.'
                  placeholder='client@example.com'
                  required
                />
                <FormTagsInput
                  type='email'
                  name='cc_recipients'
                  label='CC'
                  description='Separate addresses with Enter, comma, or semicolon.'
                  placeholder='copy@example.com'
                />
                <FormTagsInput
                  type='email'
                  name='bcc_recipients'
                  label='BCC'
                  description='Separate addresses with Enter, comma, or semicolon.'
                  placeholder='hidden@example.com'
                />
                <InvoiceEmailVariableField name='subject' label='Subject' required />
                <InvoiceEmailVariableField
                  name='body'
                  label='Body'
                  height={280}
                  disabled={isSubmitting}
                  multiline
                  needsLoader
                  required
                />

                <div className='grid grid-cols-[1fr_6.375rem] items-end gap-2'>
                  <Field>
                    <FieldLabel>Attachment</FieldLabel>

                    <div className='flex items-center gap-2 h-8 rounded-lg border bg-muted px-2.5 py-1'>
                      <PaperclipIcon size={16} className='text-muted-foreground' />
                      <span>{emailDetails?.attachment_name}</span>
                      <span className='text-xs text-muted-foreground'>
                        PDF · {language === 'ka' ? 'Georgian' : 'English'}
                      </span>
                    </div>
                  </Field>

                  <FormSelect
                    name='language'
                    items={[
                      {
                        value: 'en',
                        label: 'English',
                      },
                      {
                        value: 'ka',
                        label: 'Georgian',
                      },
                    ]}
                  />
                </div>
              </FieldGroup>
            </FieldSet>
          )}
        </div>
      </FormProvider>
    </Modal>
  );
};

export default SendInvoiceEmailModal;
