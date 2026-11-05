import React from 'react';

const Google = (props: { size?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 48 48'
      width={props.size ?? '18'}
      height={props.size ?? '18'}
    >
      <path
        fill='#EA4335'
        d='M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.9 2.6 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.7 13.2 17.9 9.5 24 9.5z'
      />
      <path
        fill='#4285F4'
        d='M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.6 3-2.3 5.6-4.9 7.4l7.6 5.9c4.4-4.1 6.8-10.1 6.8-16.8z'
      />
      <path
        fill='#FBBC05'
        d='M10.5 28.8c-1.2-3.6-1.2-7.6 0-11.2L2.6 13.2C.9 16.4 0 20 0 24s.9 7.6 2.6 10.8l7.9-6z'
      />
      <path
        fill='#34A853'
        d='M24 48c6.5 0 12-2.1 16-5.7l-7.6-5.9c-2.1 1.4-4.9 2.2-8.4 2.2-6.1 0-11.3-3.7-13.5-9l-7.9 6.1C6.5 42.6 14.6 48 24 48z'
      />
    </svg>
  );
};

export default Google;
