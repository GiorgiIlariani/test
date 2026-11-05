import React from 'react';

const Delete: React.FC<{ pathClassName?: string }> = ({ pathClassName }) => {
  return (
    <svg width='17' height='17' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12.9001 4.05C10.7201 3.83 8.52009 3.72 6.33009 3.72C5.03009 3.72 3.73009 3.79 2.44009 3.92L1.1001 4.05'
        stroke='#DC2626'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={pathClassName}
      />
      <path
        d='M4.71021 3.39L4.8502 2.53C4.9502 1.91 5.0302 1.44 6.1402 1.44H7.8602C8.9702 1.44 9.05019 1.93 9.15019 2.53L9.29019 3.38'
        stroke='#DC2626'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={pathClassName}
      />
      <path
        d='M11.49 4.13L11.06 10.73C10.99 11.76 10.93 12.56 9.10001 12.56H4.89C3.06 12.56 2.99999 11.76 2.92999 10.73L2.5 4.13'
        stroke='#DC2626'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={pathClassName}
      />
    </svg>
  );
};

export default Delete;
