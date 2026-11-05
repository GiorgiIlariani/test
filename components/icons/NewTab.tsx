import React from 'react';

const NewTab = (props: { color?: string; size?: string; className?: string }) => {
  return (
    <svg
      width={props.size ?? '24'}
      height={props.size ?? '24'}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={props.className}
    >
      <path
        d='M8.66667 7.33337L14.1333 1.8667'
        stroke={props.color ?? '#394049'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M14.6667 4.53337V1.33337H11.4667'
        stroke={props.color ?? '#394049'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.33333 1.33337H6C2.66666 1.33337 1.33333 2.66671 1.33333 6.00004V10C1.33333 13.3334 2.66666 14.6667 6 14.6667H10C13.3333 14.6667 14.6667 13.3334 14.6667 10V8.66671'
        stroke={props.color ?? '#394049'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default NewTab;
