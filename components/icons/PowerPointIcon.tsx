import * as React from 'react';

const PowerPointIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='22'
    height='22'
    viewBox='0 0 48 48'
    className={className}
  >
    <path fill='#FF8A65' d='M41 10H25v28h16a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1'></path>
    <path
      fill='#FBE9E7'
      d='M24 29h14v2H24zm0 4h14v2H24zm6-18a6 6 0 0 0 0 12 6 6 0 0 0 6-6h-6z'
    ></path>
    <path fill='#FBE9E7' d='M32 13v6h6a6 6 0 0 0-6-6'></path>
    <path fill='#E64A19' d='M27 42 6 38V10l21-4z'></path>
    <path
      fill='#FFF'
      d='M16.828 17H12v14h3v-4.823h1.552q2.482-.001 3.965-1.304t1.482-3.412q0-4.461-5.171-4.461m-.534 6.785H15v-4.364h1.294q2.461 0 2.461 2.158 0 2.207-2.461 2.206'
    ></path>
  </svg>
);

export default PowerPointIcon;
