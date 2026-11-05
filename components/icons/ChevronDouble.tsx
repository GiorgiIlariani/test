import React from 'react';

const ChevronDouble: React.FC<JSX.IntrinsicElements['svg']> = (props) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M3.5 3L8.5 8L3.5 13'
      stroke='#394049'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M8.5 3L13.5 8L8.5 13'
      stroke='#394049'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default ChevronDouble;
