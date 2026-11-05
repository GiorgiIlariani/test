import React from 'react';

const CircleBinWithoutBackground: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M12.25 3.48844C10.3075 3.29594 8.35333 3.19678 6.405 3.19678C5.25 3.19678 4.095 3.25511 2.94 3.37178L1.75 3.48844'
        stroke='#5A636F'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4.95898 2.89925L5.08732 2.13508C5.18065 1.58091 5.25065 1.16675 6.23648 1.16675H7.76482C8.75065 1.16675 8.82648 1.60425 8.91398 2.14091L9.04232 2.89925'
        stroke='#5A636F'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10.9956 5.33179L10.6164 11.206C10.5522 12.1218 10.4997 12.8335 8.87224 12.8335H5.12724C3.49974 12.8335 3.44724 12.1218 3.38307 11.206L3.00391 5.33179'
        stroke='#5A636F'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.02539 9.625H7.96789'
        stroke='#5A636F'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5.54102 7.29175H8.45768'
        stroke='#5A636F'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default CircleBinWithoutBackground;
