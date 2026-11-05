import { Props } from './types';
import React from 'react';
import { TimeOffTableItem } from 'components';
import { objectKeys } from 'helpers';
const TimeOffTrafficTable: React.FC<Props> = (props) => {
  const skeletonItems = [
    { timeOffType: 'Vacation' },
    { timeOffType: 'Sick leave' },
    { timeOffType: 'Parental leave' },
    { timeOffType: 'Unpaid leave' },
  ];

  return (
    <div>
      <div className='grid grid-cols-23 rounded-lg  grid-flow-row '>
        <div
          onClick={() => props.sortTimeOffsHandler('first_name')}
          className={`${
            props.sortedField === 'first_name' ? 'font-semibold' : 'font-normal'
          }  col-span-5 cursor-pointer border border rounded-tl-md border-zinc-200 bg-indigo-50 pl-12 pb-3 pt-4 text-sm  text-indigo-900`}
        >
          Type
        </div>
        <div className='col-span-6 border border-l-0 border-zinc-200 bg-indigo-50 pl-4 pb-3 pt-4 text-sm  text-indigo-900'>
          Projects
        </div>
        <div
          onClick={() => props.sortTimeOffsHandler('vacation_hours')}
          className={`${
            props.sortedField === 'vacation_hours' ? 'font-semibold' : 'font-normal'
          }  cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
        >
          Vacation hrs
        </div>
        <div
          onClick={() => props.sortTimeOffsHandler('excluded_hours')}
          className={`${
            props.sortedField === 'excluded_hours' ? 'font-semibold' : 'font-normal'
          }  cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
        >
          Excluded hrs
        </div>
        <div
          onClick={() => props.sortTimeOffsHandler('excluded_percentage')}
          className={`${
            props.sortedField === 'excluded_percentage' ? 'font-semibold' : 'font-normal'
          } cursor-pointer col-span-8 border border-l-0 rounded-tr-md border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
        >
          Excluded %
        </div>
      </div>
      {props.timeOffIsLoading ? (
        skeletonItems.map((item, index) => (
          <div key={index} className='grid grid-cols-23 rounded-lg grid-flow-row'>
            <div className='col-span-5 border border-gray-100 bg-white text-zinc-700 py-5 pl-6 pr-1'>
              <div className='flex items-center space-x-4'>
                <div className='h-4 w-3 bg-gray-300 animate-pulse rounded-sm'></div>
                <span className='capitalize'>{item.timeOffType}</span>
              </div>
            </div>
            <div className='col-span-6 border border-l-0 border-gray-100 bg-gray-300 animate-pulse h-16'></div>
            <div className='col-span-2 border border-l-0 border-gray-100 bg-gray-300 animate-pulse h-16'></div>
            <div className='col-span-2 border border-l-0 border-gray-100 bg-gray-300 animate-pulse h-16'></div>
            <div className='col-span-8 border border-l-0 border-gray-100 bg-gray-300 animate-pulse h-16'></div>
          </div>
        ))
      ) : (
        <>
          {objectKeys(props.timeOffsTraffic).map((el, i) => {
            const value = props.timeOffsTraffic[el];
            return (
              <div key={el} className='grid grid-cols-23 col-span-23'>
                <TimeOffTableItem
                  last={i === objectKeys(props.timeOffsTraffic).length - 1}
                  timeOffItem={value}
                  timeOffType={el}
                  permissions={props.permissions}
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default TimeOffTrafficTable;
