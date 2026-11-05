const Coin: React.FC<{
  width?: string;
  height?: string;
  className?: string;
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
        d='M7.33337 10.4501C7.33337 11.1559 7.88337 11.7334 8.55254 11.7334H9.92754C10.5142 11.7334 10.9909 11.2293 10.9909 10.6151C10.9909 9.94593 10.6975 9.7076 10.2667 9.55176L8.06671 8.78176C7.62671 8.62593 7.33337 8.3876 7.33337 7.71843C7.33337 7.10426 7.81004 6.6001 8.39671 6.6001H9.77171C10.45 6.60926 11 7.1776 11 7.88343'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`${props.pathClassName}`}
      />
      <path
        d='M9.16663 11.7793V12.4576'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`${props.pathClassName}`}
      />
      <path
        d='M9.16663 5.87598V6.59098'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`${props.pathClassName}`}
      />
      <path
        d='M9.15754 16.4818C13.2026 16.4818 16.4817 13.2027 16.4817 9.15766C16.4817 5.11264 13.2026 1.8335 9.15754 1.8335C5.11252 1.8335 1.83337 5.11264 1.83337 9.15766C1.83337 13.2027 5.11252 16.4818 9.15754 16.4818Z'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`${props.pathClassName}`}
      />
      <path
        d='M11.8983 18.2232C12.7233 19.3873 14.0708 20.1482 15.6108 20.1482C18.1133 20.1482 20.1483 18.1132 20.1483 15.6107C20.1483 14.089 19.3966 12.7415 18.2508 11.9165'
        stroke='#5A636F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`${props.pathClassName}`}
      />
    </svg>
  );
};

export default Coin;
