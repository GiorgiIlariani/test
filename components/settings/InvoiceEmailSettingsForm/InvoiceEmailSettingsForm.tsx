import type { InvoiceEmailSettingsFormProps } from './types';
import { FormProvider } from 'react-hook-form';
import { Button, FormInput, FormTagsInput } from 'components';
import { EmailSettingsSection, EmailTemplateField } from './components';
import { useInvoiceEmailSettingsForm } from './useInvoiceEmailSettingsForm';

const InvoiceEmailSettingsForm: React.FC<InvoiceEmailSettingsFormProps> = ({ settings }) => {
  const {
    form,
    onSubmit,
    isDirty,
    isSubmitting,
    reset,
    smtpConfigured,
    needsAppPassword,
    isReplacingAppPassword,
    startReplacingAppPassword,
    cancelReplacingAppPassword,
  } = useInvoiceEmailSettingsForm(settings);

  return (
    <FormProvider {...form}>
      <form
        className='flex max-w-4xl flex-col gap-6 pb-8'
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <EmailSettingsSection
          title='Sender'
          description='Invoice emails are authenticated and sent through this Google mailbox.'
          disabled={isSubmitting}
        >
          <FormInput
            name='from_email'
            type='email'
            label='Gmail address'
            placeholder='name@company.com'
            required
          />
          <div className='grid items-start gap-2 sm:grid-cols-[minmax(0,1fr)_auto]'>
            <FormInput
              name='smtp_app_password'
              type='password'
              label='Google app password'
              description={
                <>
                  {needsAppPassword
                    ? 'Enter the 16-character app password generated for this mailbox. '
                    : 'An app password is saved securely and cannot be displayed. '}
                  <a
                    href='https://myaccount.google.com/apppasswords'
                    target='_blank'
                    rel='noreferrer'
                  >
                    {needsAppPassword ? 'Create an app password.' : 'Manage app passwords.'}
                  </a>
                </>
              }
              placeholder={needsAppPassword ? '16-character app password' : '•••• •••• •••• ••••'}
              autoComplete='new-password'
              disabled={!needsAppPassword}
              required={needsAppPassword}
            />
            {smtpConfigured && !needsAppPassword && (
              <Button
                type='button'
                variant='outline'
                className='sm:mt-7'
                onClick={startReplacingAppPassword}
              >
                Replace
              </Button>
            )}
            {smtpConfigured && isReplacingAppPassword && (
              <Button
                type='button'
                variant='outline'
                className='sm:mt-7'
                onClick={cancelReplacingAppPassword}
              >
                Cancel
              </Button>
            )}
          </div>
        </EmailSettingsSection>

        <EmailSettingsSection
          title='Internal recipients'
          description='Optionally copy internal recipients on every invoice email.'
          disabled={isSubmitting}
        >
          <FormTagsInput
            type='email'
            name='to_recipients'
            label='To'
            description='Separate addresses with Enter, comma, or semicolon.'
            placeholder='name@company.com'
          />
          <FormTagsInput
            type='email'
            name='cc_recipients'
            label='CC'
            description='Separate addresses with Enter, comma, or semicolon.'
            placeholder='copy@company.com'
          />
          <FormTagsInput
            type='email'
            name='bcc_recipients'
            label='BCC'
            description='Separate addresses with Enter, comma, or semicolon.'
            placeholder='hidden@company.com'
          />
        </EmailSettingsSection>

        <EmailSettingsSection
          title='Initial invoice email'
          description='These defaults can be reviewed and amended before an invoice is sent.'
          disabled={isSubmitting}
        >
          <EmailTemplateField name='initial_subject' label='Email subject' required />
          <EmailTemplateField
            name='initial_body'
            label='Email body'
            multilineDisabled={isSubmitting}
            multiline
            required
          />
        </EmailSettingsSection>

        <EmailSettingsSection
          title='Follow-Up #1'
          description='Used for the automatic reminder 5 days before the invoice due date.'
          disabled={isSubmitting}
        >
          <EmailTemplateField
            name='follow_up_1_body'
            label='Email body'
            multilineDisabled={isSubmitting}
            multiline
            required
          />
        </EmailSettingsSection>

        <EmailSettingsSection
          title='Follow-Up #2'
          description='Used for the automatic reminder when the invoice reaches its due date.'
          disabled={isSubmitting}
        >
          <EmailTemplateField
            name='follow_up_2_body'
            label='Email body'
            multilineDisabled={isSubmitting}
            multiline
            required
          />
        </EmailSettingsSection>

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            disabled={!isDirty || isSubmitting}
            onClick={reset}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvoiceEmailSettingsForm;
