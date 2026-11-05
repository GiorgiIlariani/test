import React from 'react';

const Arrow: React.FC<JSX.IntrinsicElements['svg']> = (props) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M10 19L3 12M3 12L10 5M3 12L21 12'
      stroke='#6B7280'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default Arrow;
