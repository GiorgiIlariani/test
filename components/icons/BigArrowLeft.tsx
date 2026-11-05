import React from 'react';

const BigArrowLeft = (props: { color?: string; size?: string }) => {
  return (
    <svg
      width={props.size ?? '24'}
      height={props.size ?? '24'}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M14.43 18.0698L20.5 11.9998L14.43 5.92982'
        stroke={props.color ?? '#4F46E5'}
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.50008 12L20.3301 12'
        stroke={props.color ?? '#4F46E5'}
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default BigArrowLeft;
