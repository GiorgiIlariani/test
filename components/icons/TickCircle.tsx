import React from 'react';

const TickCircle: React.FC<
  JSX.IntrinsicElements['svg'] & { size?: string; disableBackground?: boolean }
> = (props) => {
  return (
    <svg
      width={props.size ?? '20'}
      height={props.size ?? '20'}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      {!props.disableBackground && (
        <path
          d='M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z'
          fill='#D1FAE5'
        />
      )}

      <path
        d='M8.8167 12.9834C8.65003 12.9834 8.4917 12.9167 8.37503 12.8L6.0167 10.4417C5.77503 10.2 5.77503 9.80002 6.0167 9.55835C6.25837 9.31669 6.65837 9.31669 6.90003 9.55835L8.8167 11.475L13.1 7.19169C13.3417 6.95002 13.7417 6.95002 13.9834 7.19169C14.225 7.43335 14.225 7.83335 13.9834 8.07502L9.25837 12.8C9.1417 12.9167 8.98337 12.9834 8.8167 12.9834Z'
        fill='#059669'
      />
    </svg>
  );
};

export default TickCircle;
