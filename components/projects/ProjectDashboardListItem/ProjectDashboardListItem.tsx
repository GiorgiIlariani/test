import { Props } from './types';
import React from 'react';
import { useProjectDashboardListItem } from './useProjectDashboardListItem';
import { analytics, formatDate, generateAvatarSrc } from 'helpers';
import { CurrentTerm } from 'types';
import { HourGlass, PhaseHoverModal, ProgressHoverModal } from 'components';
import { getProjectStatus } from '../helper';

const ProjectDashboardListItem: React.FC<Props> = (props) => {
  const { isProgressHovered, setIsProgressHovered, isPhaseHovered, setIsPhaseHovered, router } =
    useProjectDashboardListItem();
  return (
    <li className='grid grid-cols-14 py-3 border border-gray-100 rounded-md bg-white'>
      <div className='col-span-3 border-r border-gray-100 flex items-center h-[2.688rem]'>
        <div
          className='flex items-center gap-2.5 text-slate-900 font-medium pl-6 w-full group cursor-pointer'
          onClick={() => {
            router.push(`/projects/${props.project?.id}/plan`);
            analytics.track(`Project ${props.project.title} - Clicked`);
          }}
        >
          <img
            className={`rounded-full shrink-0 object-cover w-6 h-6`}
            width={100}
            height={100}
            src={props.project?.logo ?? generateAvatarSrc(props.project?.title)}
            alt={'icon'}
          />
          <div className='flex items-center justify-start gap-1 w-[80%]'>
            <p
              className='truncate group-hover:text-indigo-600 cursor-pointer'
              title={props.project?.title}
            >
              {props.project?.title}
            </p>
            {props.project?.terms?.some((term) => term.status === 'booked') && (
              <div className='relative group/booked'>
                <HourGlass />
                <div className='absolute bottom-full -left-7 mb-2 w-max p-2 bg-white border border-gray-200 shadow-xs text-zinc-700 text-xs rounded-sm opacity-0 group-hover/booked:opacity-100 z-50'>
                  Has booked{' '}
                  {props.project?.terms?.filter((term) => term.status === 'booked').length === 1
                    ? 'term'
                    : 'terms'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='col-span-2 border-r border-gray-100 pl-3.5 flex items-center h-[2.688rem] text-xs text-[#5A636F]'>
        {formatDate(props.project?.start_date, false, true)}-
        {formatDate(props.project?.end_date!, false, true)}
      </div>
      <div className='col-span-1 border-r border-gray-100 flex items-center justify-center h-[2.688rem]'>
        <div
          className={`${
            getProjectStatus(props.project.status)?.color
          } uppercase text-2xs px-2 py-1 rounded-[19px]`}
        >
          {getProjectStatus(props.project.status)?.title}
        </div>
      </div>
      <div
        className='col-span-3 border-r border-gray-100 pl-3 h-[2.688rem] flex items-center relative'
        onMouseEnter={() => setIsPhaseHovered(true)}
        onMouseLeave={() => setIsPhaseHovered(false)}
      >
        <ul className='flex items-center gap-1.5 '>
          {(props.project?.current_terms as CurrentTerm[])?.slice(0, 2)?.map((term) => (
            <li
              key={term.id}
              className='text-indigo-600 text-2xs px-2 py-[2px] bg-indigo-50 rounded-[19px]'
            >
              {term.name}
            </li>
          ))}
          {!(props.project?.current_terms?.length && props.project?.current_terms?.length > 2) || (
            <div className={`text-indigo-600 text-2xs px-2 py-[2px] bg-indigo-50 rounded-[19px]`}>
              +{props.project?.terms?.length - 2}
            </div>
          )}
        </ul>
        {!(isPhaseHovered && props.project?.current_terms?.length) || (
          <PhaseHoverModal terms={props.project?.current_terms ?? []} />
        )}
      </div>
      <div
        className='col-span-3 border-r border-gray-100 px-3 flex items-center justify-center h-[2.688rem] relative'
        onMouseEnter={() => setIsProgressHovered(true)}
        onMouseLeave={() => setIsProgressHovered(false)}
      >
        <div className='w-full bg-indigo-50 rounded-full h-2.5'>
          <div
            className='bg-indigo-600 h-2.5 rounded-full'
            style={{
              width: `${
                props.project.total_revenue
                  ? Math.round(
                      (props.project?.released?.[props.currency]! /
                        props.project?.total_revenue?.[props.currency]) *
                        100,
                    )
                  : 0
              }%`,
            }}
          ></div>
        </div>
        {isProgressHovered && (
          <ProgressHoverModal project={props.project} currency={props.currency} />
        )}
      </div>
      <div className='col-span-2 border-r border-gray-100 px-3.5 h-[2.688rem] flex items-center'>
        <div className='flex gap-1.5 w-full items-center text-slate-900 pt-1'>
          <>
            <img
              className={`rounded-full shrink-0 object-cover w-4 h-4`}
              width={100}
              height={100}
              src={
                props.project?.owner_avatar ??
                generateAvatarSrc(
                  props.project?.owner_name?.split(' ')?.[0],
                  props.project?.owner_name?.split(' ')?.[1],
                )
              }
              alt={'icon'}
            />
            <p
              className='w-full text-xs truncate capitalize'
              title={props.project?.owner_name ?? ''}
            >
              {props.project?.owner_name ?? ''}
            </p>{' '}
          </>
        </div>
      </div>
    </li>
  );
};

export default ProjectDashboardListItem;
