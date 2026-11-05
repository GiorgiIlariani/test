import React from 'react';
import { useRouter } from 'next/router';
import { SpaceMan, Space } from 'assets';

const NotFound = () => {
  const router = useRouter();

  return (
    <div
      className='flex flex-col  bg-cover bg-bottom bg-no-repeat items-center w-screen h-screen'
      style={{
        backgroundImage: `url(${Space.src})`,
      }}
    >
      <h1 className='text-white text-[13rem] font-bold mt-[10vh]'>404</h1>
      <h2 className='text-white text-base -mt-8'>We told you not to stay too far from the ship!</h2>
      <div className='w-44 h-44 pt-8'>
        <img src={SpaceMan.src} alt='spaceman' className='animate-bounce' />
      </div>
      <button
        className='text-white hover:bg-white hover:text-black border font-bold border-white px-5 py-3 rounded-md mt-4 transition-all duration-200'
        onClick={() => router.back()}
      >
        Take me back
      </button>
    </div>
  );
};

export default NotFound;
