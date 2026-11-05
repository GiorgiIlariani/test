'use client';
import React, { RefObject, createRef, useEffect, useRef, useState } from 'react';
import { MainButton, RightArrow } from 'components';
import { Props } from './types';
import Image from 'next/image';

const ServiceComponentLeft: React.FC<Props> = (props) => {
  const sliderLeftRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [listen, setListen] = useState(false);

  const imageRefs = useRef<RefObject<HTMLButtonElement>[]>(
    Array.from(Array(props.images.length).keys()).map(() => createRef()),
  );

  const scrollHandler = (e: Event) => {
    for (let i = 1; i <= props.images.length; i++) {
      (e.target as HTMLDivElement)?.scrollLeft <= 900 && setIndex(0);
      (e.target as HTMLDivElement)?.scrollLeft > 900 * i && setIndex(i);
    }
  };

  useEffect(() => {
    listen &&
      document
        .getElementById(`sliderLeft-${props.title}`)
        ?.addEventListener('scroll', scrollHandler);

    return () =>
      document
        .getElementById(`sliderLeft-${props.title}`)
        ?.removeEventListener('scroll', scrollHandler);
  }, [listen]);

  const previousImage = () => {
    document
      .getElementById(`sliderLeft-${props.title}`)
      ?.removeEventListener('scroll', scrollHandler);
    setListen(false);

    if (index - 1 >= 0) {
      imageRefs.current[index - 1]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setIndex((prev) => prev - 1);
    }
  };
  const nextImage = () => {
    document
      .getElementById(`sliderLeft-${props.title}`)
      ?.removeEventListener('scroll', scrollHandler);
    setListen(false);

    if (index + 1 !== props.images.length) {
      setIndex((prev) => prev + 1);

      imageRefs.current[index + 1]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };
  const jumpToImage = (index: number) => {
    document
      .getElementById(`sliderLeft-${props.title}`)
      ?.removeEventListener('scroll', scrollHandler);
    setListen(false);
    setIndex(index);
    imageRefs.current[index]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  return (
    <div
      className='flex md:flex-row flex-col md:items-center items-start justify-center gap-10 md:mt-[92px] relative'
      ref={props.refs}
    >
      <div className='md:w-[49%] right-6 md:right-0 md:h-full  md:top-0  relative'>
        <div className='flex md:hidden px-4 mb-10 ml-6 items-start justify-between w-full'>
          <h3 className='text-2xl leading-7 font-bold text-black'>{props.title}</h3>
        </div>
        <div
          ref={sliderLeftRef}
          onMouseEnter={() => setListen(true)}
          onMouseLeave={() => setListen(false)}
          id={`sliderLeft-${props.title}`}
          className={`w-[400px] mr-[40%] md:w-full md:mr-0 overflow-x-auto  border-r-24 border-t-24 border-b-24 border-indigo-50 bg-indigo-50  rounded-r-3xl top-0 left-0 flex  h-full`}
        >
          <div
            className={` md:w-full md:mr-0 overflow-x-auto  border-indigo-50 bg-indigo-50  rounded-r-3xl top-0 left-0 flex  h-full`}
          >
            <div className='flex gap-6'>
              {props.images.map((item, i) => (
                <div
                  key={i}
                  className='w-[600px] md:w-[900px] h-full rounded-3xl  overflow-clip'
                  ref={imageRefs.current[i] as unknown as RefObject<HTMLDivElement>}
                >
                  <Image
                    alt={props.title}
                    src={item}
                    style={{
                      objectFit: 'cover',
                    }}
                    priority
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <nav className='flex flex-col items-center gap-4 absolute  bottom-24 left-[40%]  md:left-[35%]  z-50  h-12'>
          <div className='flex  items-center  justify-start gap-4'>
            <button
              onClick={previousImage}
              id='leftArrowLeft'
              className={`${
                index == 0 ? 'bg-white border border-[#DFE2E7]' : 'bg-[#050F26]'
              } rotate-180  rounded-full p-3`}
            >
              <RightArrow color={index === 0 ? '#9DA1A9' : null} />
            </button>
            <button
              onClick={nextImage}
              id='rightArrowLeft'
              className={`${
                index == props.images.length - 1 ? 'bg-white' : 'bg-[#050F26]'
              }  rounded-full p-3`}
            >
              <RightArrow color={index == props.images.length - 1 ? '#9DA1A9' : null} />
            </button>
          </div>
          <ol className='flex gap-2'>
            {Array.from(Array(props.images.length).keys()).map((el, i) => (
              <li
                key={el}
                className={`${
                  index === i ? 'bg-[#050F26]' : 'bg-white border border-[#DFE2E7]'
                } h-[10px] w-[10px] rounded-full shadow-md cursor-pointer`}
                onClick={() => jumpToImage(i)}
              ></li>
            ))}
          </ol>
        </nav>
      </div>

      <section className='md:w-1/2 relative overflow-clip px-4 md:pr-24' id='scrollable'>
        <div className='hidden md:flex items-start justify-between w-full'>
          <h3 className='text-2xl leading-7 font-bold text-black'>{props.title}</h3>
        </div>
        <div className='flex flex-col'>
          <ol className='flex flex-col gap-8 my-10 pr-10'>
            {props.services.map((item) => (
              <li key={item.title} className='col-span-1'>
                <div className='flex gap-4 text-lg leading-5 text-black font-medium pb-4'>
                  {item.icon}
                  {item.title}
                </div>
                <span className='text-base leading-7 text-black/72 font-normal'>{item.text}</span>
              </li>
            ))}
          </ol>
          <MainButton title='Book a Demo' />
        </div>
      </section>
    </div>
  );
};

export default ServiceComponentLeft;
