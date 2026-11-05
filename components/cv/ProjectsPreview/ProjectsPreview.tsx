import { getFormattedDate } from 'helpers';
import { Props } from './types';
import React from 'react';

const ProjectsPreview: React.FC<Props> = (props) => {
  return (
    <>
      <div className={` bg-[#DDDCDD] w-120 mb-8 h-px `} />

      <section id='projects' className='pb-8'>
        <h2 className='text-[#F93B1D] text-xs font-bold'>
          {props.projects?.length === 1 ? 'PROJECT' : 'PROJECTS'}
        </h2>
        <ul className='pt-6 flex flex-col'>
          {props.projects?.map((project, i) => {
            const createMarkup = (data: string) => {
              const handleLists = data?.replace(/<ul>/g, '<ul style="list-style-type: disc;">');
              return {
                __html: handleLists?.replace(/\<a/g, '<a target="_blank"') as string,
              };
            };
            return (
              <li key={project.id} className='relative'>
                <div className={`${i > 0 ? 'pt-6' : ''}  flex items-center gap-2`}>
                  <div
                    className={`${
                      i > 0 ? 'top-[22px]' : '-top-[2px]'
                    } flex items-center justify-center absolute  left-0`}
                  >
                    <div className='border border-[#E5E5E5]  w-5 h-5  rounded-full  ' />
                    <p className='text-xs absolute text-[#A9A8A9] font-semibold'>{i + 1}</p>
                  </div>
                  <p className='text-2xs font-semibold capitalize pl-7'>{`${project.title} • ${project.role}`}</p>
                </div>
                <p className='text-2xs font-light pt-2'>{`${project.company ?? ''}${
                  project.industry?.name
                    ? ` • ${project.industry?.name} ${project.start_date ? '•' : ''}`
                    : ''
                }${
                  project.start_date && project.is_preferred
                    ? ` ${getFormattedDate(project.start_date, true, true)} ${
                        project.end_date
                          ? `- ${getFormattedDate(project.end_date, true, true)}`
                          : '- Present'
                      }`
                    : ''
                }`}</p>
                <div className='flex gap-10 relative'>
                  <div className='absolute top-0 left-0 w-5 ml-[58px]' />
                  <div>
                    {project.description && (
                      <div className='flex flex-col pt-1.5 gap-1'>
                        <p className='text-[#A9A8A9] text-[8px] font-semibold'>Description</p>
                        <div
                          className='mce flex  text-2xs! [&_div]:leading-3 [&_div]:pl-0 [&_div]:text-black [&_p]:text-2xs [&_div]:gap-0! [&_div]:text-2xs! flex-col gap-4 [&_p] [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
                          dangerouslySetInnerHTML={createMarkup(project.description)}
                        />
                      </div>
                    )}
                    {project.responsibility && (
                      <div className='flex flex-col pt-1.5 gap-1'>
                        <p className='text-[#A9A8A9] text-[8px] font-semibold'>
                          Main features & Responsibilities
                        </p>
                        <div
                          className='mce flex  text-2xs! [&_div]:leading-3 [&_div]:pl-0 [&_div]:text-black [&_p]:text-2xs [&_div]:gap-0! [&_div]:text-2xs! flex-col gap-4 [&_p] [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
                          dangerouslySetInnerHTML={createMarkup(project.responsibility)}
                        />
                      </div>
                    )}

                    {project.skills?.length ? (
                      <div className='flex flex-col pt-1.5 gap-1'>
                        <p className='text-[#A9A8A9] text-[8px] font-semibold'>Technologies</p>
                        <p className='text-2xs'>
                          {project.skills?.map((item) => item.title).join(', ')}
                        </p>
                      </div>
                    ) : (
                      ''
                    )}
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

export default ProjectsPreview;
