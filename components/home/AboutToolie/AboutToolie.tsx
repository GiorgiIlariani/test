'use client';
import { ImageFour, ImageNine, ImageOne, ImageSeven, ImageTwo, Tick } from 'components';

const AboutToolie = () => {
  const benefits = [
    'CEOs',
    'Finance experts',
    'Project managers',
    'Sales teams',
    'HR teams',
    'Operation team',
  ];

  return (
    <section
      id='about'
      className='bg-white lg:px-0 px-4 py-11 lg:py-[11.5rem] text-black w-full h-full  overflow-x-clip'
    >
      <h2
        className={`md:text-[2rem]  text-2xl leading-8 font-bold md:leading-10 mb-8 lg:mb-16 text-center`}
      >
        Skippit - story behind the unsung hero
      </h2>
      <div className='lg:flex lg:gap-20 relative items-start'>
        <div className='flex flex-col gap-8 lg:pl-24 lg:w-1/2 lg:pr-20'>
          <p className='break-normal lg:leading-7 text-black/72 text-base'>
            Managing agency operations is hard. Having grown ours from four to several hundred
            people, we know the pain. We have been there and tried it all: spreadsheet wizardry?
            Sticking various software together? Filling the missing gaps with custom tooling? <br />
            Searching through multiple spreadsheets and switching between several software systems
            to get answers for simple questions was no fun, but what was even worse was that many
            important questions hardly had any reliable answers let alone the real-time ones: what’s
            the profitability of the project? who’s available to staff a new project? is this report
            updated? You’ve also been there and done that. So you know the feeling. Through our
            pain, Toolie was born. A single software to manage all of agency operations.
          </p>

          <h4 className='font-bold text-xl leading-6 mb-6'>And transform the lives of</h4>
          <ul
            className='lg:grid lg:grid-flow-row lg:grid-cols-2 
          flex text-black/72 flex-col gap-[1.625rem] leading-7'
          >
            {benefits.map((item) => (
              <li key={item} className='flex col-span-1 gap-4'>
                <Tick />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className='lg:w-1/2 mt-20 lg:mt-0  relative'>
          <div
            className='hidden lg:flex lg:relative -translate-y-[5%] translate-x-[0%]
           top-0 left-0 overflow-auto lg:flex-wrap bg-indigo-50 w-200 
           lg:w-225 rounded-3xl h-81 lg:h-200 py-4 pl-4 '
          >
            <ImageOne />
            <ImageNine />
            <ImageSeven />
            <ImageFour />
          </div>
          <div className='lg:hidden relative overflow-x-scroll ml-4  -translate-y-[15%] translate-x-[0%] top-0 left-0 flex flex-row   border-t-24 border-b-24 border-indigo-50 bg-indigo-50  w-750 lg:w-225 rounded-3xl  lg:h-200'>
            <div className=' top-0 left-48'>
              <ImageTwo />
            </div>
            <div className=' top-0 -left-12'>
              <ImageOne />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutToolie;
