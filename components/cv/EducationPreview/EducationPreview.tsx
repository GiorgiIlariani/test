import { getFormattedDate } from 'helpers';
import { Props } from './types';
import React from 'react';

const EducationPreview: React.FC<Props> = (props) => {
  return (
    <>
      <div className={` bg-[#DDDCDD] w-120 mb-8 h-px `} />

      <section id='educations' className='pb-8 w-120 flex flex-col'>
        <h2 className='text-xs text-[#F93B1D] font-bold  text-left'>
          {props.educations?.length === 1 ? 'EDUCATION' : 'EDUCATIONS'}
        </h2>
        <ul className='w-full flex flex-col'>
          {props.educations?.map((educations) => {
            return (
              <li key={educations.id} className='pt-6'>
                <div>
                  <div className='flex gap-10'>
                    <p className='text-2xs font-semibold'>{educations.university}</p>
                  </div>
                  <div className='flex gap-10'>
                    <p className={`pt-1  text-2xs font-light`}>{`${educations.faculty} • ${
                      educations.degree
                    } ${
                      educations.start_date && educations.is_preferred
                        ? ` • ${getFormattedDate(educations.start_date, true, true)} ${
                            educations.finish_date
                              ? `- ${getFormattedDate(educations.finish_date, true, true)}`
                              : '- Present'
                          }`
                        : ''
                    }`}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default EducationPreview;
