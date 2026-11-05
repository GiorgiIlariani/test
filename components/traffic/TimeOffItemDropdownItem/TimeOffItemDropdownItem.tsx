import { Props } from './types';
import React from 'react';
import { useElementOverflows } from 'hooks';
import { analytics, can } from 'helpers';
const TimeOffItemDropdownItem: React.FC<Props> = (props) => {
  const [projectOverflows, projectsWrapperRef] = useElementOverflows<HTMLDivElement>();
  return (
    <div key={props.employee.id} className='col-span-full grid-cols-23 grid '>
      <div
        className={`col-span-5 ${
          props.last && 'rounded-bl-md'
        } border-r border-gray-100 py-2 pl-12 bg-white text-zinc-700`}
      >
        <a
          className={`ml-4 block truncate ${
            !can('employee::list', props.permissions) ? 'pointer-events-none' : 'hover:underline'
          }`}
          href={`employee/${props.employee.id}/information`}
          target='_blank'
          rel='noopener noreferrer'
          onClick={(e) => {
            if (!can('employee::list', props.permissions)) {
              e.preventDefault();
              return;
            }

            analytics.track('Traffic Vacations - Redirect to Employee');
          }}
        >
          {props.employee.first_name} {props.employee.last_name}
        </a>
      </div>
      <div
        className={`col-span-6 group before:hidden before:h-3.5 before:border-gray-100 before:w-3.5 ${
          projectOverflows && 'hover:before:block'
        } before:absolute before:z-50 before:bg-white before:border-l-2 before:border-b-2  before:-translate-y-1/2 before:top-1/2 before:rotate-45 before:left-[95%] before:-translate-x-1/2 overflow-visible relative  border-r border-gray-100 py-2 pr-7 pl-6 bg-white text-zinc-700`}
      >
        {projectOverflows ? (
          <div className='absolute rounded-lg hidden whitespace-nowrap  z-20 shadow-md group-hover:flex px-6 py-4 flex-col bg-white border border-gray-100 h-auto top-1/2 -translate-y-1/2 left-[95%]'>
            {props.employee.projects.map((el) => {
              return <span key={el}>{el}</span>;
            })}
          </div>
        ) : (
          ''
        )}
        <div className='truncate' ref={projectsWrapperRef}>
          {props.employee.projects.map((el, i) => {
            return (
              <span key={el}>
                {el}
                {i !== props.employee.projects.length - 1 && ', '}
              </span>
            );
          })}
        </div>
      </div>
      <div className='col-span-2  border-r border-gray-100 py-2 pl-6 bg-white text-zinc-700'>
        {props.employee.vacation_hours}
      </div>
      <div className='col-span-2  border-r border-gray-100 py-2 pl-6 bg-white text-zinc-700'>
        {props.employee.excluded_hours}
      </div>
      <div
        className={`${
          props.last && 'rounded-br-md'
        } col-span-8  border-r border-gray-100 py-2 pl-6 bg-white text-zinc-700`}
      >
        {props.employee.excluded_percentage}%
      </div>
    </div>
  );
};

export default TimeOffItemDropdownItem;
