import React from 'react';
import { Props } from './types';
import Link from 'next/link';

const MainButton: React.FC<Props> = (props) => {
  return (
    <Link
      href={'https://calendly.com/taso-rdbr/intro-meeting'}
      className={`${props.customClass} z-50!`}
      target='blank'
      id={props.id}
    >
      <p
        className='bg-cyan-300 text-base max-h-[3.75rem]
       max-w-[265px] w-fit text-black py-5 px-10 rounded-[30px]
       shadow-lg font-medium leading-5'
      >
        {props.title}
      </p>
    </Link>
  );
};

export default MainButton;
