import React, { useState } from 'react';
import { AuthPage, ForgotPasswordForm, Check, GmailLogo } from 'components';
import Link from 'next/link';

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);

  return (
    <AuthPage title='Forgot password' heading={isSent ? undefined : 'Forgot password'}>
      {isSent ? (
        <div className='flex flex-col items-center justify-center gap-4'>
          <Check />
          <h1 className='font-bold text-2xl text-center w-[80%]'>
            Reset link was successfully sent to your email!
          </h1>

          <Link
            href='https://mail.google.com/mail/u/4/?tab=cm#inbox'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 rounded-md py-2 px-4 border bg-background hover:bg-primary hover:text-background transition text-sm font-medium mt-8'
          >
            <GmailLogo /> Go to Gmail
          </Link>
        </div>
      ) : (
        <ForgotPasswordForm setIsSent={setIsSent} />
      )}
    </AuthPage>
  );
};

export default ForgotPassword;
