import React from 'react';

const ThinLineTrashCan: React.FC<{
  className?: string;
  pathClassName?: string;
}> = (props) => {
  return (
    <svg
      width='16'
      height='18'
      viewBox='0 0 16 18'
      className={props.className}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M13.8335 4.83333L13.1107 14.9521C13.0484 15.8243 12.3227 16.5 11.4483 16.5H4.55203C3.67763 16.5 2.9519 15.8243 2.8896 14.9521L2.16683 4.83333M6.3335 8.16667V13.1667M9.66683 8.16667V13.1667M10.5002 4.83333V2.33333C10.5002 1.8731 10.1271 1.5 9.66683 1.5H6.3335C5.87326 1.5 5.50016 1.8731 5.50016 2.33333V4.83333M1.3335 4.83333H14.6668'
        stroke='#DC2626'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={props.pathClassName}
      />
    </svg>
  );
};

export default ThinLineTrashCan;
