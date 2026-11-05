import React from 'react';
import { useLoginForm } from './useLoginForm';
import {
  AuthFormCard,
  Button,
  FieldGroup,
  FormCheckbox,
  FormInput,
  FormInputGroup,
  buttonVariants,
} from 'components';
import { LoginFormType } from 'types';
import { FormProvider } from 'react-hook-form';
import { analytics } from 'helpers';
import { EyeClosedIcon, EyeIcon, LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link';

const LoginForm: React.FC = () => {
  const { form, submitHandler, isLoading, showPassword, setShowPassword } = useLoginForm();

  return (
    <div className='w-full'>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data: LoginFormType) => {
            submitHandler(data);
          })}
          noValidate={true}
        >
          <AuthFormCard>
            <FieldGroup>
              <FormInput
                name='email'
                label='Email'
                type='email'
                placeholder='stranger@redberry.ge'
                rules={{
                  minLength: {
                    message: 'Email should consist of at least 3 characters.',
                    value: 3,
                  },
                  required: {
                    message: 'Email is required.',
                    value: true,
                  },
                }}
                required
              />

              <FormInputGroup
                name='password'
                label='Password'
                autoComplete='current-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                rules={{
                  required: {
                    message: 'Password is required.',
                    value: true,
                  },
                }}
                icon={showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                onIconClick={() => setShowPassword((visible) => !visible)}
                required
              />

              <div className='flex flex-wrap items-center justify-between gap-3'>
                <FormCheckbox name='remember-me' label='Remember me' wrapperClassName='w-fit' />
                <Link
                  href='/forgot-password'
                  className={buttonVariants({ variant: 'link', className: 'p-0!' })}
                  onClick={() => analytics.track('User - Recover Password')}
                >
                  Forgot password?
                </Link>
              </div>
            </FieldGroup>
          </AuthFormCard>

          <Button type='submit' size='xl' className='w-full mt-8' disabled={isLoading}>
            {isLoading && <LoaderCircleIcon className='animate-spin' />}
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginForm;
