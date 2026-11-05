import React from 'react';

const Folder: React.FC<{
  className?: string;
  pathClassName?: string;
}> = (props) => {
  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      className={props.className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M29.3333 14.76V22.2C29.3333 26.1333 26.1333 29.3333 22.2 29.3333H9.79999C5.86666 29.3333 2.66666 26.1333 2.66666 22.2V12.5867H28.9867C29.1867 13.1867 29.2933 13.8 29.32 14.4533C29.3333 14.5467 29.3333 14.6667 29.3333 14.76Z'
        fill='#4F46E5'
        className={'text-red-300'}
      />
      <path
        opacity='0.32'
        d='M28.9867 12.5866H2.66666V8.55996C2.66666 5.30663 5.30666 2.66663 8.55999 2.66663H11.6667C13.84 2.66663 14.52 3.37329 15.3867 4.53329L17.2533 7.01329C17.6667 7.55996 17.72 7.63996 18.4933 7.63996H22.2133C25.3733 7.62663 28.0667 9.70662 28.9867 12.5866Z'
        fill='#4F46E5'
        className={props.pathClassName}
      />
    </svg>
  );
};

export default Folder;
