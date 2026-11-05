import React from 'react';

const Reports: React.FC<{
  className?: string;
  width?: string;
  pathClassName?: string;
}> = (props) => {
  return (
    <svg
      width={props.width || '22'}
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        className={`${props.pathClassName}`}
        d='M6.87988 18.1501V16.0801'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        className={`${props.pathClassName}`}
        d='M12 18.15V14.01'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        className={`${props.className}`}
        d='M17.1201 18.1499V11.9299'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        className={`${props.pathClassName}`}
        d='M17.1199 5.8501L16.6599 6.3901C14.1099 9.3701 10.6899 11.4801 6.87988 12.4301'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        className={`${props.pathClassName}`}
        d='M14.1899 5.8501H17.1199V8.7701'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        className={`${props.pathClassName}`}
        d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default Reports;
