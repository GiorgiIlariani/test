import React from 'react';

const BlueTick: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
  return (
    <svg
      width='12'
      height='9'
      viewBox='0 0 12 9'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M11.3332 1L3.99984 8.33333L0.666504 5'
        stroke={props.stroke || 'blue'}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default BlueTick;
