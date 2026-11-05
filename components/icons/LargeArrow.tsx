import React from 'react';

const LargeArrow: React.FC<{ size?: string }> = (props) => {
  return (
    <svg
      width={props.size ?? '24'}
      height={props.size ?? '24'}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M4.5 15L12 7.5L19.5 15'
        stroke='#3D434C'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default LargeArrow;
