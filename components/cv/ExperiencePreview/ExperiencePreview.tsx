import { Props } from './types';
import React from 'react';

const ExperiencePreview: React.FC<Props> = (props) => {
  return (
    <>
      <div className={` bg-[#DDDCDD] w-120 mb-8 h-px `} />

      <section id='experiences' className='pb-8 w-120 flex flex-col'>
        <h2 className='text-xs text-[#F93B1D] font-bold text-left'>
          {props.experience?.length === 1 ? 'WORK EXPERIENCE' : 'WORK EXPERIENCES'}
        </h2>
        <ul className='w-full flex flex-col'>
          {props.experience?.map((experience) => {
            const createMarkup = (data: string) => {
              const handleLists = data?.replace(/<ul>/g, '<ul style="list-style-type: disc;">');
              return {
                __html: handleLists?.replace(/\<a/g, '<a target="_blank"'),
              };
            };
            return (
              <li key={experience.id} className='pt-6'>
                <div>
                  <div className='flex gap-10'>
                    <p className='text-2xs  font-semibold'>{experience.company}</p>
                  </div>
                  <div className='flex gap-10'>
                    <p className={`pt-1  text-2xs font-light`}>{`${experience.position} ${
                      experience.location ? `• ${experience.location}` : ''
                    } ${
                      experience.start_date && experience.is_preferred
                        ? ` • ${new Date(experience.start_date).getFullYear()} ${
                            experience.end_date
                              ? `- ${new Date(experience.end_date).getFullYear()}`
                              : '- Present'
                          }`
                        : ''
                    }`}</p>
                  </div>

                  {experience.description && (
                    <div className='flex flex-col pt-[6px] gap-1'>
                      <p className='text-[#A9A8A9] text-2xs font-semibold'>Description</p>
                      <div
                        className='mce flex  text-2xs! [&_div]:leading-3 [&_div]:pl-0 [&_div]:text-black [&_p]:text-2xs [&_div]:gap-0! [&_div]:text-2xs! flex-col gap-4 [&_p] [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
                        dangerouslySetInnerHTML={createMarkup(experience.description)}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default ExperiencePreview;
