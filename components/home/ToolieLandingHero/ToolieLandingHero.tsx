import { heroImage } from 'assets';
import { MainButton, ToolieLogo } from 'components';
import React from 'react';
import Image from 'next/image';
import { useToolieLandingHero } from './useToolieLandingHero';
import { CHANGING_WORDS } from 'helpers';
import Link from 'next/link';

const ToolieLandingHero: React.FC<{}> = () => {
  const { activeIndex } = useToolieLandingHero();
  return (
    <div className='bg-my-gradient pb-24 w-full h-full md:h-full pt-9'>
      <header className='flex items-center justify-center md:px-24 md:justify-between'>
        <div className='flex items-center gap-3  md:w-1/2'>
          <ToolieLogo />
        </div>
        <div className='hidden md:flex  items-center justify-center w-fit gap-x-6'>
          <Link href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`} className=''>
            <div className='rounded-lg bg-white py-3 px-6 text-black text-sm font-medium leading-4'>
              Log in
            </div>
          </Link>
          <a href={'https://calendly.com/taso-rdbr/intro-meeting'} target='_blank' className='flex'>
            <div className='rounded-lg bg-cyan-300 py-3 px-6 text-black text-sm font-medium leading-4'>
              Book a call
            </div>
          </a>
        </div>
      </header>
      <div className='flex items-start md:mt-14 overflow-clip'>
        <section
          id='main'
          className='md:pl-24 md:w-1/2 flex flex-col md:items-start 
              items-center justify-center overflow-x-hidden
               relative z-20 '
        >
          <h1
            className='text-white/65 md:text-5xl text-[2rem] mt-11 
               md:text-left text-center md:max-w-xl  leading-14
              md:px-0 px-4 mb-6'
          >
            Still looking for that Excel sheet for
            <span className='overflow-hidden align-bottom  leading-0 h-[3.1rem] inline-block text-white'>
              <div
                style={{
                  marginTop: `-${3.1 * activeIndex}rem`,
                }}
                className='transition-all duration-500  ease-in-out'
              >
                {CHANGING_WORDS.map((word) => (
                  <span className={`block leading-[3.1rem]`} key={word.id}>
                    {word.title}?
                  </span>
                ))}
              </div>
            </span>
            <br />
            Skip it!
          </h1>
          <p className='md:text-lg text-base max-w-xl lg:text-left text-center text-white leading-7'>
            Manage and forecast agency resources, projects, traffic, utilization and profitability
            in real-time with a single platform.
          </p>
          <div className='mt-8 md:mt-7 z-30'>
            <MainButton customClass='md:w-fit w-full' title='Book a Demo' />
          </div>
        </section>
        <section className='w-1/2 hidden  md:flex flex-wrap justify-end'>
          <div>
            <Image
              alt='toolie-hero-image'
              src={heroImage}
              style={{
                objectFit: 'cover',
              }}
              priority
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ToolieLandingHero;
