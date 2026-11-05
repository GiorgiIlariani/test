import React from 'react';

const CalendarChevron: React.FC<JSX.IntrinsicElements['svg']> = (props) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M6 3L11 8L6 13'
      stroke='#394049'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default CalendarChevron;
