import { AuthFormCard, FieldGroup, FormInputGroup, Button } from 'components';
import { FormProvider } from 'react-hook-form';
import { PasswordResetFormType } from 'types';
import { Props } from './types';
import { usePasswordResetForm } from './usePasswordResetForm';
import { EyeClosedIcon, EyeIcon, LoaderCircleIcon } from 'lucide-react';

const PasswordResetForm: React.FC<Props> = (props) => {
  const {
    isLoading,
    submitHandler,
    form,
    showNewPassword,
    setShowNewPassword,
    showRepeatPassword,
    setShowRepeatPassword,
  } = usePasswordResetForm(props.token, props.email);

  return (
    <div className='w-full'>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data: PasswordResetFormType) => {
            submitHandler(data);
          })}
          noValidate={true}
        >
          <AuthFormCard>
            <FieldGroup>
              <FormInputGroup
                name='password'
                label='New password'
                autoComplete='new-password'
                type={showNewPassword ? 'text' : 'password'}
                placeholder='••••••••'
                rules={{
                  minLength: {
                    message: 'Password should consist of at least 8 characters.',
                    value: 8,
                  },
                  required: {
                    message: 'New password is required.',
                    value: true,
                  },
                }}
                icon={showNewPassword ? <EyeIcon /> : <EyeClosedIcon />}
                onIconClick={() => setShowNewPassword((visible) => !visible)}
                required
              />

              <FormInputGroup
                name='password_confirmation'
                label='Repeat password'
                autoComplete='new-password'
                type={showRepeatPassword ? 'text' : 'password'}
                placeholder='••••••••'
                rules={{
                  minLength: {
                    message: 'Password should consist of at least 8 characters.',
                    value: 8,
                  },
                  required: {
                    message: 'Repeat password is required.',
                    value: true,
                  },
                }}
                icon={showRepeatPassword ? <EyeIcon /> : <EyeClosedIcon />}
                onIconClick={() => setShowRepeatPassword((visible) => !visible)}
                required
              />

              <input type='hidden' {...form.register('email')} />
              <input type='hidden' {...form.register('token')} />
            </FieldGroup>
          </AuthFormCard>

          <Button type='submit' size='xl' className='w-full mt-8' disabled={isLoading}>
            {isLoading && <LoaderCircleIcon className='animate-spin' />}
            {isLoading ? 'Saving...' : 'Save password'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default PasswordResetForm;
