import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useForgotPasswordForm } from './useForgotPasswordForm';
import { AuthFormCard, Button, FormInputGroup } from 'components';
import { EMAIL_REGEX } from 'config';
import { getErrorMessage } from 'helpers';
import { Props } from './types';
import { LoaderCircleIcon, MailIcon } from 'lucide-react';

const ForgotPasswordForm: React.FC<Props> = (props) => {
  const { form, submitHandler, isLoading } = useForgotPasswordForm(props.setIsSent);

  return (
    <div className='w-full'>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data: { email: string }) => {
            submitHandler(data);
          })}
          noValidate={true}
        >
          <AuthFormCard>
            <FormInputGroup
              name='email'
              label='Email'
              placeholder='stranger@redberry.ge'
              icon={<MailIcon />}
              alignIcon='inline-start'
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Enter a valid email address.',
                },
              }}
              required
            />
          </AuthFormCard>

          <Button
            type='submit'
            size='xl'
            className='w-full mt-8'
            disabled={isLoading || getErrorMessage(form.formState.errors, 'email')}
          >
            {isLoading && <LoaderCircleIcon className='animate-spin' />}
            {isLoading ? 'Sending link...' : 'Send a link'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default ForgotPasswordForm;
