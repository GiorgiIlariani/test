import React from 'react';

const ThreeDots: React.FC<{
  className?: string;
  color?: string;
  rotation?: number;
}> = (props) => {
  return (
    <svg
      width='15'
      height='3'
      className={props.className ?? ''}
      viewBox='0 0 15 3'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{
        transform: `rotate(${props.rotation ?? 0}deg)`,
      }}
    >
      <circle cx='1.5' cy='1.5' r='1.5' fill={props.color ?? '#374151'} />
      <circle cx='7.5' cy='1.5' r='1.5' fill={props.color ?? '#374151'} />
      <circle cx='13.5' cy='1.5' r='1.5' fill={props.color ?? '#374151'} />
    </svg>
  );
};

export default ThreeDots;
