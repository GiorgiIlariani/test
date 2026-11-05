import React from 'react';

const SandClock: React.FC<JSX.IntrinsicElements['svg']> = (props) => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 15 15'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M8.44497 4.58325H6.55497C5.4583 4.58325 5.37372 5.56909 5.9658 6.10575L9.03414 8.89409C9.62622 9.43075 9.54164 10.4166 8.44497 10.4166H6.55497C5.4583 10.4166 5.37372 9.43075 5.9658 8.89409L9.03414 6.10575C9.62622 5.56909 9.54164 4.58325 8.44497 4.58325Z'
      stroke='#312E81'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <rect
      x='-0.5'
      y='0.5'
      width='14'
      height='14'
      rx='7'
      transform='matrix(-1 0 0 1 14 0)'
      stroke='#BBB8B8'
    />
  </svg>
);

export default SandClock;
