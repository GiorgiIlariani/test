'use client';

import { AddButton } from 'components/shared';
import { can, analytics, convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import router from 'next/router';
import { ProjectsStatusFilter } from '../ProjectsStatusFilter';
import { Props } from './types';
import React from 'react';
import { AddProjectModal, ProfitIcon, Released } from 'components';

const ProjectsDashboardHeader: React.FC<Props> = (props) => {
  const projects = props.projects;
  const billedEmployees = Array.from(
    new Set(projects.flatMap((project) => project.active_employee_ids)),
  ).length;

  const currency = props.currency;

  return (
    <>
      <AddProjectModal
        open={!!router.query.addProject}
        onOpenChange={(open) => !open && router.replace('/projects')}
        projectOwners={props.projectOwners}
        defaultCurrency={props.defaultCurrency}
      />

      <div className='w-full'>
        <div className='flex items-center justify-between w-full mb-8'>
          <h1 className='text-[#050F26] text-2xl font-bold'>Projects</h1>
          <div className='flex items-center justify-end w-full'>
            <ProjectsStatusFilter
              isOpen={props.isOpen}
              setIsOpen={props.setIsOpen}
              filterState={props.filterState}
              setFilterState={props.setFilterState}
              updateProjectFilterState={props.updateProjectFilterState}
            />

            {can('project::create', props.permissions) && (
              <div>
                <AddButton
                  buttonText={'Add a project'}
                  className='rounded-md bg-[#4F46E5] hover:bg-indigo-800 px-6 py-3 text-sm text-white'
                  onClick={() => {
                    router.push('projects?addProject=1');
                    analytics.track('Projects - Add New Project');
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className='w-full flex items-center gap-[1%]'>
          <section className='bg-white w-[22%] rounded-md h-[8.438rem] flex flex-col items-center justify-center gap-2.5'>
            {props.isLoading ? (
              <div className='w-12 h-9 bg-gray-300 animate-pulse rounded-md'></div>
            ) : (
              <h3 className='text-slate-900 text-[2.125rem] font-semibold'>{projects.length}</h3>
            )}
            <p className='uppercase text-zinc-400 font-medium'>
              {projects.length === 1 ? 'project' : 'projects'}
            </p>
          </section>
          <section className='bg-white w-[22%] rounded-md h-[8.438rem] flex flex-col items-center justify-center gap-2.5'>
            {props.isLoading ? (
              <div className='w-12 h-9 bg-gray-300 animate-pulse rounded-md'></div>
            ) : (
              <h3 className='text-slate-900 text-[2.125rem] font-semibold'>{billedEmployees}</h3>
            )}
            <p className='uppercase text-zinc-400 font-medium'>
              {billedEmployees === 1 ? 'Billed employee' : 'Billed employees'}{' '}
            </p>
          </section>
          <section className='bg-white w-[27%] rounded-md h-[8.438rem] flex flex-col items-center justify-center gap-2.5'>
            {' '}
            {props.isLoading ? (
              <div className='w-36 h-9 bg-gray-300 animate-pulse rounded-md'></div>
            ) : (
              <h3 className='text-slate-900 text-[2.125rem] font-semibold'>
                {getCurrencySymbol(currency)}{' '}
                {convertNumbersAsPrice(
                  projects.reduce(
                    (accumulator, current) =>
                      accumulator + (current?.to_be_released?.[currency] ?? 0),
                    0,
                  ),
                )}
              </h3>
            )}
            <div className='flex items-center gap-1'>
              <Released />
              <p className='uppercase text-zinc-400 font-medium'>Upcoming Contracted Revenue </p>
            </div>
          </section>
          <section className='bg-white w-[27%] rounded-md h-[8.438rem] flex flex-col items-center justify-center gap-2.5'>
            {props.isLoading ? (
              <div className='w-36 h-9 bg-gray-300 animate-pulse rounded-md'></div>
            ) : (
              <div className='text-slate-900 text-[2.125rem] font-semibold flex items-center truncate gap-1'>
                {getCurrencySymbol(currency)}{' '}
                {convertNumbersAsPrice(
                  props.projects.reduce(
                    (accumulator, current) =>
                      accumulator + (current?.current_month?.[currency] ?? 0),
                    0,
                  ),
                )}
              </div>
            )}
            <div className='flex items-center gap-1'>
              <ProfitIcon size={21} />
              <p className='uppercase text-zinc-400 font-medium'>Revenue This month</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProjectsDashboardHeader;
