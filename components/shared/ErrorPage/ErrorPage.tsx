'use client';

import { ErrorGuy } from 'components';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { SetState } from 'types';

const ErrorPage: React.FC<{ setNotResponseError: SetState<boolean> }> = (props) => {
  const router = useRouter();
  const reloadPage = () => {
    props.setNotResponseError(false);
    router.reload();
  };
  return (
    <div
      className={twMerge(
        'flex-col items-center justify-center w-screen h-screen mt-24',
        !!getCookie('impersonation_token') && 'h-[calc(100vh-2rem)]',
      )}
    >
      <div className='flex flex-col gap-6 items-center justify-center'>
        <ErrorGuy />
        <h2 className='text-2xl font-bold'>😵 Failed to load all data</h2>
        <p>Check your internet connection or contact dev support.</p>
        <button
          className='py-2 w-24 font-medium rounded-md text-white bg-[#4F46E5] text-sm'
          onClick={reloadPage}
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
