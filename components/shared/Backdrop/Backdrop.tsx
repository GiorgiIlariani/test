import React from 'react';
import { Props } from './type';
import { twMerge } from 'tailwind-merge';
import { getCookie } from 'cookies-next';

const Backdrop: React.FC<Props> = (props) => {
  return (
    <div
      className={twMerge(
        `fixed inset-0 min-h-dvh bg-slate-900/16 transition-opacity ${props.extraClasses} ${props.className}`,
        !!getCookie('impersonation_token') && 'h-[calc(100vh-2rem)]',
      )}
      onClick={props.onClick}
      aria-hidden='true'
    />
  );
};

export default Backdrop;
