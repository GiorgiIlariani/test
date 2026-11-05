import { Props } from './types';
import React from 'react';
import { useEmployeeDropDown } from './useProjectsDropDown';
import { ChevronRight } from 'components';
import { analytics, can, formatDate } from 'helpers';

const ProjectsDropDown: React.FC<Props> = (props) => {
  const { projectIsDropped, setProjectIsDropped } = useEmployeeDropDown();

  return (
    <>
      <div
        className='col-span-4 border cursor-pointer border-gray-100 border-t-0 border-l-0 leading-[1.625rem] py-5 pl-6 bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
        onClick={() =>
          props.project.employees?.length !== 0 && setProjectIsDropped(!projectIsDropped)
        }
      >
        {!props.total && (
          <div className='flex items-center gap-4'>
            <button
              className={`${
                projectIsDropped ? 'rotate-90' : 'rotate-0'
              } transition-all duration-200 z-5`}
            >
              <ChevronRight
                color={`${props.project.employees?.length === 0 ? '#dfe2e6' : '#9CA3AF'}`}
              />
            </button>
            <p className='truncate'>{props.project.title} </p>
          </div>
        )}

        {projectIsDropped &&
          props.project.employees?.map((employee) => (
            <div className={`pl-6 pt-2 cursor-pointer`} key={employee.id}>
              <a
                className={`ml-4 block truncate ${
                  !can('employee::list', props.permissions)
                    ? 'pointer-events-none'
                    : 'hover:underline'
                }`}
                href={`employee/${employee.id}/information`}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => {
                  if (!can('employee::list', props.permissions)) {
                    e.preventDefault();
                    return;
                  }
                  e.stopPropagation();
                  analytics.track('Traffic Project - Redirect to Employee');
                }}
              >
                {employee.first_name + ' ' + employee.last_name}
              </a>
            </div>
          ))}
        {props.total && (
          <>
            <span className='px-1' />
            <span>
              Total <span className='text-zinc-400 text-xs'>({props.total})</span>
            </span>
          </>
        )}
      </div>
      <div
        className='col-span-3 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 truncate'>{props.project.client_legal_name}</div>
        {projectIsDropped &&
          props.project.employees?.map((employee) => (
            <div className='pt-2 transition-all duration-150 ease-in-out' key={employee.id}></div>
          ))}
      </div>
      <div
        className='col-span-2 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2'>
          {props.project?.start_date && formatDate(props.project?.start_date)}
        </div>
        {projectIsDropped &&
          props.project.employees?.map((employee) => (
            <div className='pt-2 transition-all duration-150 ease-in-out' key={employee.id}>
              {formatDate(employee.latest_term_start_date)}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2'>
          {props.project.end_date ? formatDate(props.project.end_date) : ''}
        </div>
        {projectIsDropped &&
          props.project.employees?.map((employee) => (
            <div className='pt-2' key={employee.id}>
              {employee.latest_term_end_date ? formatDate(employee.latest_term_end_date) : ''}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-6 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2'>
          {props.project.scheduled_hours?.toFixed(1).replace(/\.0+$/, '')}
        </div>
        {projectIsDropped &&
          props.project.employees?.map((employee) => (
            <div className='pt-2' key={employee.id}>
              {employee.scheduled_hours.toFixed(1).replace(/\.0+$/, '')}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-6 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2'>
          {props.project.billable_hours?.toFixed(1).replace(/\.0+$/, '')}
        </div>
        {projectIsDropped &&
          props.project.employees?.map((employee) => (
            <div className='pt-2' key={employee.id}>
              {employee.billable_hours.toFixed(1).replace(/\.0+$/, '')}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-6 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2'>
          {props.project.non_billable_hours?.toFixed(1).replace(/\.0+$/, '')}
        </div>
        {projectIsDropped &&
          props.project.employees?.map((employee) => (
            <div className='pt-2' key={employee.id}>
              {' '}
              {employee.non_billable_hours.toFixed(1).replace(/\.0+$/, '')}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-6 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        {props.total ? (
          ' '
        ) : (
          <>
            <div className='flex items-center gap-2'>
              {props.project.billable_percentage?.toFixed(1).replace(/\.0+$/, '')}%
            </div>
            {projectIsDropped &&
              props.project.employees?.map((employee) => (
                <div className='pt-2' key={employee.id}>
                  {employee.billable_percentage.toFixed(1).replace(/\.0+$/, '')}%
                </div>
              ))}
          </>
        )}
      </div>

      <div
        className='col-span-4 pl-6 border border-gray-100 border-t-0 border-l-0  py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        {props.total ? (
          ' '
        ) : (
          <>
            <div className='flex items-center gap-2'>
              <p className='truncate'>
                {' '}
                {props.project.owner_first_name
                  ? props.project.owner_first_name + ' ' + props.project.owner_last_name
                  : ''}
              </p>
            </div>
            {projectIsDropped &&
              props.project.employees?.map((employee) => (
                <div className='pt-2' key={employee.id}></div>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default ProjectsDropDown;
