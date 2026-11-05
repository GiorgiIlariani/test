import React from 'react';

const CircleInfo: React.FC<JSX.IntrinsicElements['svg']> = (props) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M7.99984 1.33329C4.33317 1.33329 1.33317 4.33329 1.33317 7.99996C1.33317 11.6666 4.33317 14.6666 7.99984 14.6666C11.6665 14.6666 14.6665 11.6666 14.6665 7.99996C14.6665 4.33329 11.6665 1.33329 7.99984 1.33329Z'
      stroke='#312E81'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M8 10.6666L8 7.33329'
      stroke='#312E81'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M8.00342 5.33337L7.99743 5.33337'
      stroke='#312E81'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default CircleInfo;
