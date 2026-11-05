import React from 'react';

const Link = (props: { color?: string }) => {
  return (
    <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6.53005 5.47021C7.65505 6.59521 7.65505 8.41521 6.53005 9.53521C5.40505 10.6552 3.58504 10.6602 2.46504 9.53521C1.34504 8.41021 1.34004 6.59021 2.46504 5.47021'
        stroke={props.color ?? '#DFE2E7'}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5.29498 6.70494C4.12498 5.53494 4.12498 3.63494 5.29498 2.45994C6.46498 1.28494 8.36498 1.28994 9.53998 2.45994C10.715 3.62994 10.71 5.52994 9.53998 6.70494'
        stroke={props.color ?? '#DFE2E7'}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default Link;
