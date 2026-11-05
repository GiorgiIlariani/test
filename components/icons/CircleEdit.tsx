import React from 'react';

const CircleEdit: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
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
        d='M12.6329 8.69355L8.52678 12.8816C8.37174 13.0406 8.2217 13.3539 8.19169 13.5707L8.00664 15.1322C7.94162 15.6961 8.36173 16.0816 8.94189 15.9852L10.5523 15.7202C10.7774 15.6816 11.0925 15.5226 11.2475 15.3587L15.3536 11.1707C16.0638 10.4478 16.3839 9.62368 15.2786 8.61644C14.1783 7.61883 13.3431 7.97064 12.6329 8.69355Z'
        stroke='#555E6A'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.9478 9.39246C12.1628 10.7226 13.2831 11.7395 14.6735 11.8744'
        stroke='#555E6A'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect x='0.5' y='0.5' width='23' height='23' rx='11.5' stroke='#DBDEE3' />
    </svg>
  );
};

export default CircleEdit;
