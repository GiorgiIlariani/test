const PaginationArrow: React.FC<{
  rotate?: string;
  disabled?: boolean;
  className?: string;
}> = (props) => {
  return (
    <svg
      width='7'
      height='14'
      viewBox='0 0 7 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`${props.rotate === 'left' ? 'rotate-180' : 'rotate-270'} ${props.className}`}
    >
      <path
        d='M1.00002 1.72L5.34669 6.06667C5.86002 6.58 5.86002 7.42 5.34669 7.93333L1.00002 12.28'
        stroke={`${props.disabled ? '#999DA5' : '#323841'}`}
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default PaginationArrow;
