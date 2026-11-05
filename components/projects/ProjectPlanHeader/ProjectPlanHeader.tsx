import { Props } from './types';
import React from 'react';
import { useProjectPlanHeader } from './useProjectPlanHeader';
import { CalendarIcon, ThreeDots } from 'components/icons';
import { ShadcnSidebarTrigger } from 'components/shared';
import { generateAvatarSrc, formatDate, can } from 'helpers';
import { getProjectStatus } from '../helper';
import { ProjectPlanNav } from '../ProjectPlanNav';
import { AddInvoicesMenu } from '../AddInvoicesMenu';
import { PROJECT_TYPE } from 'config';

const ProjectPlanHeader: React.FC<Props> = (props) => {
  const { dropDownList, triggerRef, moreOptionDropdownRef, isOpen, setIsOpen, openDropdown } =
    useProjectPlanHeader(props.setDeleteDialog, props.permissions);

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between top-0 z-40 h-[4.5rem] w-full bg-white border-b border-zinc-200 py-6 pr-16 relative'>
        <ShadcnSidebarTrigger type='button' className='absolute top-5 left-2' />

        <div className='flex flex-col items-start justify-center h-[4.5rem] w-full'>
          <div className='flex items-center justify-start w-full pl-13'>
            {props.projectIsLoading ? (
              <div className='w-72 h-9 bg-gray-300 animate-pulse rounded-md' />
            ) : (
              <div className='flex items-center gap-2.5 text-slate-900 font-medium cursor-pointer grow'>
                <img
                  className={`rounded-full shrink-0 object-cover w-6 h-6`}
                  width={100}
                  height={100}
                  src={
                    props.projectState?.logo ??
                    generateAvatarSrc(props.projectState?.title ?? 'Untitled')
                  }
                  alt={'icon'}
                />

                <p
                  className='text-xl font-medium block min-w-full pr-12 truncate'
                  title={props.projectState?.title}
                >
                  {props.projectState?.title}
                </p>
              </div>
            )}

            <div className='flex items-center text-xs w-full justify-between'>
              <div className='flex items-center gap-[0.813rem]'>
                <div className='rounded-sm w-fit py-1 flex items-center justify-start gap-4 px-2'>
                  {props.projectIsLoading ? (
                    <div className='w-44 h-5 mt-2 bg-gray-300 ml-8 animate-pulse rounded-md' />
                  ) : (
                    <>
                      <div className='flex items-center gap-1'>
                        <CalendarIcon height='14' width='14' />
                        <p>{`${formatDate(props.projectState?.start_date!)} - ${formatDate(
                          props.projectState?.end_date!,
                        )}`}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className='flex items-center justify-center h-[2.688rem]'>
                  {props.projectIsLoading ? (
                    <div className='w-14 h-5 mt-2 bg-gray-300 animate-pulse rounded-xs' />
                  ) : (
                    <div
                      className={`${
                        getProjectStatus(props.projectState?.status)?.color
                      } uppercase text-2xs px-2 py-1 rounded-[4px]`}
                    >
                      {getProjectStatus(props.projectState?.status)?.title}
                    </div>
                  )}
                </div>
              </div>

              {dropDownList.length > 0 && (
                <button
                  onClick={openDropdown}
                  ref={triggerRef}
                  className='transition-150-ease-in group relative flex cursor-pointer items-center space-x-2 rounded-md py-2 px-3 text-xs font-medium'
                >
                  <span className='hover:bg-zinc-200 hover:rounded-full p-1.5 rotate-90'>
                    <ThreeDots />
                  </span>
                  {isOpen && (
                    <div
                      ref={moreOptionDropdownRef}
                      className='flex flex-col shadow-md items-end justify-end transition-150-ease-in text-xs pointer-events-none absolute top-10 -left-30 w-44 py-2.5 rounded-md border border-neutral-100 bg-white opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 z-30'
                    >
                      {dropDownList.map((item) => (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            item.onClick?.();
                          }}
                          key={item.title}
                          type='button'
                          className='hover:bg-[#F3F4F6] w-full py-1 pl-3 text-start hover:rounded-md transition-all duration-300 text-xs'
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between bg-white border rounded-md p-2.5 my-4 mx-13'>
        <ProjectPlanNav permissions={props.permissions} />
        <div className='flex items-center'>
          {!props.projectIsLoading &&
            props.projectState?.type !== PROJECT_TYPE.INTERNAL &&
            (can('all-invoices::create', props.permissions) ? (
              <AddInvoicesMenu setInvoicesIsOpen={props.setInvoicesIsOpen} />
            ) : (
              can('project-invoice::create', props.permissions) && (
                <button
                  type='button'
                  onClick={() => props.setInvoicesIsOpen('invoice')}
                  className='h-10 rounded-md bg-[#4F46E5] py-1 px-6 text-white text-xs hover:bg-indigo-800 focus:ring-1 focus:ring-indigo-600 focus:ring-offset-2'
                >
                  Create invoice
                </button>
              )
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPlanHeader;
