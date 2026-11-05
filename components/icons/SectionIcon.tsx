import React from 'react';
import { SectionIconVariant } from 'types';

const SectionIcon: React.FC<{ variant?: SectionIconVariant }> = ({ variant = 'middle' }) => {
  const pathByVariant = {
    middle: (
      <path
        d='M3 11h16v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z'
        stroke='currentColor'
        strokeWidth={1.5}
      />
    ),
    top: (
      <path
        d='M3 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2H3V5Z'
        stroke='currentColor'
        strokeWidth={1.5}
      />
    ),
    bottom: (
      <path
        d='M3 15h16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2Z'
        stroke='currentColor'
        strokeWidth={1.5}
      />
    ),
  };

  return (
    <svg width='22' height='22' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect x='3' y='3' width='16' height='16' rx='2' stroke='currentColor' strokeWidth={1.5} />
      {pathByVariant[variant]}
    </svg>
  );
};

export default SectionIcon;
