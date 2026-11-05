const CircleCheck: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
  return (
    <svg
      width='20'
      height='20'
      className='w-6 h-5'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M10 18.3332C14.5834 18.3332 18.3334 14.5832 18.3334 9.99984C18.3334 5.4165 14.5834 1.6665 10 1.6665C5.41669 1.6665 1.66669 5.4165 1.66669 9.99984C1.66669 14.5832 5.41669 18.3332 10 18.3332Z'
        stroke='#4B5563'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.45831 9.99993L8.81665 12.3583L13.5416 7.6416'
        stroke='#4B5563'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default CircleCheck;
