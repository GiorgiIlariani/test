import { Props } from './types';
import React from 'react';
import { Redberry } from 'assets';
import { Location } from 'components';

const PersonalDataPreview: React.FC<Props> = (props) => {
  const __html = props.data.brief_intro?.replace(/\<a/g, '<a target="_blank"') as string;
  const briefIntroSection = props.data.sections?.find((item) => item.title === 'Brief intro');

  const getCoverLineStyles = () => {
    const isLogoShown = !props.data.variant;
    const location = props.data?.location;

    if (isLogoShown) {
      return location ? 'top-[115px]' : 'top-[95px]';
    } else {
      return location ? 'top-[42px]' : 'top-[23px]';
    }
  };

  return (
    <>
      <section id='employee-info' className='flex flex-col relative'>
        <div className='flex flex-col items-center gap-[26px]'>
          <div
            className={`${
              !props.data.variant || props.data.variant === 'RDBR' ? 'flex' : 'hidden'
            } w-full h-[47px]`}
          >
            <img src={props.data.logo ?? Redberry.src} alt='Preview' className=' h-[47px]' />
          </div>
          <section className='w-[483px]'>
            <div>
              <h1 className={`text-[#F93B1D] text-base font-bold capitalize`}>
                {props.data.first_name} {props.data.last_name}
              </h1>
              {props.data.location && (
                <div className='flex gap-1 mt-1 items-center'>
                  <Location />
                  <p className='text-2xs'>{props.data.location}</p>
                </div>
              )}
            </div>
          </section>
        </div>
        {briefIntroSection?.selected && props.data.brief_intro ? (
          <>
            <div
              className='mce w-[483px] mt-4 mb-8 flex flex-col gap-4 pt-1 text-2xs [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
              dangerouslySetInnerHTML={{ __html }}
            />
          </>
        ) : (
          <div
            className={`${getCoverLineStyles()} absolute left-0 bg-white w-[483px] h-[3px] z-50`}
          ></div>
        )}
      </section>
    </>
  );
};

export default PersonalDataPreview;
