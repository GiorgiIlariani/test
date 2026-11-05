import { getFormattedDate } from 'helpers';
import { Props } from './types';
import React from 'react';

const CoursesPreview: React.FC<Props> = (props) => {
  return (
    <>
      <div className={` bg-[#DDDCDD] w-120 mb-8 h-px `} />

      <section id='courses' className='pb-8 w-120 flex flex-col'>
        <h2 className='text-xs text-[#F93B1D] font-bold  text-left'>
          {props.courses?.length === 1 ? 'COURSE' : 'COURSES'}
        </h2>
        <ul className='w-full flex flex-col'>
          {props.courses?.map((courses) => {
            return (
              <li key={courses.id} className='pt-6'>
                <div>
                  <div className='flex gap-10'>
                    <p className='text-2xs font-semibold'>{courses.school}</p>
                  </div>
                  <div className='flex gap-10'>
                    <p className=' py-1 text-2xs font-light'>{`${courses.course_name}${
                      courses.start_date
                        ? ` • ${getFormattedDate(courses.start_date, true, true)} ${
                            courses.end_date
                              ? `- ${getFormattedDate(courses.end_date, true, true)}`
                              : '- Present'
                          }`
                        : ''
                    } `}</p>
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

export default CoursesPreview;
