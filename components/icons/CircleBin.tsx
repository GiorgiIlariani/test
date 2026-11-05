import React from 'react';

const CircleBin: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <rect x='0.5' y='0.5' width='23' height='23' rx='11.5' fill='white' />
      <path
        d='M18 7.98653C15.78 7.76653 13.5467 7.6532 11.32 7.6532C10 7.6532 8.68 7.71987 7.36 7.8532L6 7.98653'
        stroke='#555E6A'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.6665 7.31337L9.81317 6.44004C9.91984 5.80671 9.99984 5.33337 11.1265 5.33337H12.8732C13.9998 5.33337 14.0865 5.83337 14.1865 6.44671L14.3332 7.31337'
        stroke='#555E6A'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16.5669 10.0933L16.1336 16.8066C16.0603 17.8533 16.0003 18.6666 14.1403 18.6666H9.86026C8.00026 18.6666 7.94026 17.8533 7.86693 16.8066L7.43359 10.0933'
        stroke='#555E6A'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10.8867 15H13.1067'
        stroke='#555E6A'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10.3335 12.3334H13.6668'
        stroke='#555E6A'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect x='0.5' y='0.5' width='23' height='23' rx='11.5' stroke='#DBDEE3' />
    </svg>
  );
};

export default CircleBin;
