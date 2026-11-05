import { Props } from './types';
import React from 'react';
import { useProjectsDashboard } from './useProjectsDashboard';
import { EmptyBudgetEmoji, ProjectDashboardListItem, ProjectDashboardSkeleton } from 'components';

const ProjectsDashboard: React.FC<Props> = (props) => {
  const { headers } = useProjectsDashboard();
  const currency = props.currency;
  return (
    <div className='py-12'>
      <ul className='grid grid-cols-14 border border-gray-100 rounded-md bg-white sticky top-0 z-20'>
        {headers.map((el) => (
          <li
            key={el.title}
            className={`${el.className} border-r border-gray-100 pl-3 py-2 text-[#5A636F] text-xs font-medium`}
          >
            {el.title}
          </li>
        ))}
      </ul>
      {props.isLoading ? (
        <ProjectDashboardSkeleton />
      ) : props.projects.length ? (
        <ul className='flex flex-col gap-2 py-2'>
          {props.projects?.map((project) => (
            <ProjectDashboardListItem key={project.id} project={project} currency={currency} />
          ))}
        </ul>
      ) : (
        <section className='flex flex-col gap-6 items-center justify-center mt-20 mb-16'>
          <EmptyBudgetEmoji />

          <div className='flex flex-col gap-2 text-center'>
            <h3 className='font-medium'>No {props.selectedFilteredStateString} projects</h3>
            <p className='text-sm text-[#5A636F]'>
              There is nothing in {props.selectedFilteredStateString} projects, yet.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectsDashboard;
