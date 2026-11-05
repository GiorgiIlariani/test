import { FreeOfChargeToggle } from 'components';
import React from 'react';
import { useProjectTable } from './useProjectTable';
import { Props } from './types';
import { getCurrencySymbol } from 'helpers';

const ProjectsTrafficTable: React.FC<Props> = (props) => {
  const { getValues } = useProjectTable();
  return (
    <div className='border border-zinc-200 w-full rounded-md'>
      <div className='flex text-left'>
        <div className='text-indigo-900 justify-center border-r border-zinc-200 bg-indigo-50 w-2/6'>
          <div className='border-b border-zinc-200 pl-4 pt-4 h-22 flex justify-start'>Employee</div>
          <div className='border-b border-zinc-200 pl-4 py-4'>Rate</div>
          <div className='border-b border-zinc-200 pl-4 py-4'>Engagement</div>
          <div className='pl-4  py-4'>Free of charge</div>
        </div>
        <div className='w-4/6 text-zinc-700'>
          <div className='border-b border-zinc-200  pl-4 pt-4 h-22'>
            {props.logDetailIsLoading ? (
              <div className='mt-1 w-36 h-5 animate-pulse rounded-md bg-gray-300' />
            ) : (
              getValues('employee.name')
            )}
            {props.logDetailIsLoading ? (
              <div className='mt-1 w-24 h-5 animate-pulse rounded-md bg-gray-300' />
            ) : (
              <p className='text-zinc-400 text-sm'>{`${getValues('employee.job_title')} ${
                getValues('employee.seniority') ? `• ${getValues('employee.seniority')}` : ''
              }`}</p>
            )}
          </div>
          <div className='border-b border-zinc-200 pl-4  py-4'>
            {props.logDetailIsLoading ? (
              <div className='mt-1 w-20 h-5 animate-pulse rounded-md bg-gray-300' />
            ) : getValues('employee.rate') ? (
              <p>
                <span>{getCurrencySymbol(getValues('employee.currency'))}</span>
                <span>{getValues('employee.rate')}</span>
              </p>
            ) : (
              '-'
            )}
          </div>
          <div className='border-b border-zinc-200 pl-4  py-4'>
            {props.logDetailIsLoading ? (
              <div className='mt-1 w-20 h-5 animate-pulse rounded-md bg-gray-300' />
            ) : (
              `${
                getValues('employee.engagement') !== '-'
                  ? `${getValues('employee.engagement')}%`
                  : '-'
              }`
            )}
          </div>
          <div className='flex items-start pl-4 py-4'>
            {props.logDetailIsLoading ? (
              <div className='mt-1 w-14 h-5 animate-pulse rounded-2xl bg-gray-300' />
            ) : (
              <FreeOfChargeToggle
                inputName={`employee.is_free_of_charge`}
                showProject={true}
                pageUniquePart={''}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTrafficTable;
