import { Props } from './types';
import React from 'react';
import { ProjectsDropDown } from 'components';
import { useProjectsTrafficTable } from './useProjectsTrafficTable';

const ProjectsTrafficTable: React.FC<Props> = (props) => {
  const { totals } = useProjectsTrafficTable(props.projectsTraffic);
  return (
    <>
      <div className='h-screen overflow-auto'>
        <div className='grid grid-cols-23 grid-flow-row sticky top-0 z-10'>
          <div
            className={`${
              props.sortField === 'title' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-4 border border rounded-tl-md border-zinc-200 bg-indigo-50 pl-12 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('title')}
          >
            Project
          </div>
          <div className='col-span-3 border border-l-0 border-zinc-200 bg-indigo-50 pl-4 pb-3 pt-4 text-sm  text-indigo-900'>
            Client
          </div>
          <div
            className={`${
              props.sortField === 'start_date' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-4 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('start_date')}
          >
            Start date
          </div>
          <div
            className={`${
              props.sortField === 'end_date' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-4 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('end_date')}
          >
            End date
          </div>
          <div
            className={`${
              props.sortField === 'scheduled_hours' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('scheduled_hours')}
          >
            Scheduled
          </div>
          <div
            className={`${
              props.sortField === 'billable_hours' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('billable_hours')}
          >
            Billable
          </div>
          <div
            className={`${
              props.sortField === 'non_billable_hours' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('non_billable_hours')}
          >
            Non-billable
          </div>
          <div
            className={`${
              props.sortField === 'billable_percentage' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('billable_percentage')}
          >
            Billable %
          </div>
          <div
            className={`${
              props.sortField === 'owner_first_name' ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-4 border border-l-0 rounded-tr-md border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable('owner_first_name')}
          >
            Project Owner
          </div>
        </div>
        <ul className='border-l border-r border-gray-100'>
          {props.projectIsLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className='w-full grid grid-cols-23 col-span-23 mb-2'>
                <div className='col-span-4 border border-gray-100 border-t-0 border-l-0 leading-[1.625rem] py-5 pl-6 bg-white text-zinc-700'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 bg-gray-300 animate-pulse rounded-sm'></div>
                      <div className='h-4 w-40 bg-gray-300 animate-pulse'></div>
                    </div>
                  </div>
                </div>
                <div className='col-span-3 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-32 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-4 pl-6 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-32 bg-gray-300 animate-pulse'></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {props.projectsTraffic?.map((project) => (
                <li key={project.id} className='w-full grid grid-cols-23 col-span-23'>
                  <ProjectsDropDown project={project} permissions={props.permissions} />
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
      {props.projectsTraffic.length ? (
        <div className='grid grid-cols-23 w-full bg-white border-t border-gray-100 text-gray-500 text-left text-xs'>
          <div className='col-span-11 px-4 py-2 cursor-auto'>
            Count: {props.projectsTraffic.length} project
            {props.projectsTraffic.length > 1 && 's'}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Scheduled'>
            C:{totals.scheduled_hours?.count} T:{+totals.scheduled_hours?.total.toFixed(1)!}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Billable'>
            C:{totals.billable_hours?.count} T:{+totals.billable_hours?.total.toFixed(1)!}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Non-billable'>
            C:{totals.non_billable_hours?.count} T:{+totals.non_billable_hours?.total.toFixed(1)!}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ProjectsTrafficTable;
