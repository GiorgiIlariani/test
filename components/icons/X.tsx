import React from 'react';

const X: React.FC<JSX.IntrinsicElements['svg'] & { size?: number; stroke?: string }> = (props) => {
  return (
    <svg
      width={props.size ?? '20'}
      height={props.size ?? '20'}
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M15.625 4.375L4.375 15.625'
        stroke={props.stroke ?? '#050F26'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15.625 15.625L4.375 4.375'
        stroke={props.stroke ?? '#050F26'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default X;
