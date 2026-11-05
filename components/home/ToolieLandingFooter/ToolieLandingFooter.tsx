import { contactInformation } from 'helpers';
import React from 'react';
import { Linkedin } from 'components/icons';
import Image from 'next/image';

const ToolieLandingFooter: React.FC<{}> = () => {
  return (
    <section id='contact' className='bg-white pb-40 lg:px-0 px-4'>
      <h3
        className='lg:text-center text-left font-bold 
      text-2xl lg:text-[2.5rem] leading-8 lg:leading-10 mb-14'
      >
        👋 Hey, Let’s get in touch for more info
      </h3>
      <div className='flex justify-start lg:justify-center items-center flex-wrap gap-6 lg:px-24'>
        {contactInformation.map((contact) => (
          <div
            key={contact.id}
            className='border rounded-xl grow lg:min-w-[25rem] p-6 flex bg-white border-gray-100 gap-x-6 items-center justify-between'
          >
            <div className='flex items-center justify-start gap-x-6'>
              <Image
                src={contact.image}
                alt=''
                className='w-[4.5rem] h-[4.5rem] object-cover rounded-full'
              />
              <div className='space-y-2 '>
                <p className='text-black flex flex-col text-xl leading-7'>
                  <span className='font-bold'>{contact.name}</span>
                  <span className='text-sm leading-5 text-black/50'>{contact.position}</span>
                </p>
              </div>
            </div>
            <a
              href={contact.linkedIn}
              target='_blank'
              className='border border-gray-100 p-3 rounded-full flex items-center justify-center'
            >
              <Linkedin letterPathClassName='fill-white' backgroundPathClassName='fill-[#006699]' />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolieLandingFooter;
