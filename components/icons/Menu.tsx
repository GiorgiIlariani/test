import React from 'react';

const Menu: React.FC<{
  stroke: string;
  size?: string;
}> = (props) => {
  return (
    <svg
      width={props.size ?? '16'}
      height={props.size ?? '16'}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='vuesax/linear/menu'>
        <g id='menu'>
          <path
            id='Vector'
            d='M3 7H21'
            className={`${props.stroke}`}
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            id='Vector_2'
            d='M3 12H21'
            className={`${props.stroke}`}
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            id='Vector_3'
            d='M3 17H21'
            className={`${props.stroke}`}
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </g>
      </g>
    </svg>
  );
};

export default Menu;
