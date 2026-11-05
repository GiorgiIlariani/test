const TrafficIcon: React.FC<{
  className?: string;
  width?: string;
  pathClassName?: string;
}> = (props) => {
  return (
    <svg
      width={props.width || '22'}
      className={`${props.className}`}
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M8 2V5'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={props.pathClassName}
      />
      <path
        d='M16 2V5'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={props.pathClassName}
      />
      <path
        d='M3.5 9.08997H20.5'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={props.pathClassName}
      />
      <path
        d='M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={props.pathClassName}
      />
      <path
        d='M11.9955 13.7H12.0045'
        stroke='#292D32'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={props.pathClassName}
      />
      <path
        d='M8.29431 13.7H8.30329'
        stroke='#292D32'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.29431 16.7H8.30329'
        stroke='#292D32'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default TrafficIcon;
