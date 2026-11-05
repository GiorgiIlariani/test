const CircleTick = (props: JSX.IntrinsicElements['svg']) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M9.99984 18.3334C14.5832 18.3334 18.3332 14.5834 18.3332 10C18.3332 5.41669 14.5832 1.66669 9.99984 1.66669C5.4165 1.66669 1.6665 5.41669 1.6665 10C1.6665 14.5834 5.4165 18.3334 9.99984 18.3334Z'
      stroke={props.color || '#9DA1A9'}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M6.4585 10L8.81683 12.3583L13.5418 7.64166'
      stroke={props.color || '#9DA1A9'}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default CircleTick;
