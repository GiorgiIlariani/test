import { Badge, CareerLogTimelineItem } from 'components';
import React from 'react';
import { CareerHistory } from 'types';
import { Props } from './types';
import { twMerge } from 'tailwind-merge';

const CareerLogTimeline: React.FC<Props> = (props) => {
  return (
    <div className='h-96 overflow-y-scroll z-30'>
      {props.careerLog.length === 0 && !props.logIsLoading ? (
        <div className='flex items-center justify-center mt-24 text-xl text-gray-300 font-bold'>
          No career history so far
        </div>
      ) : props.logIsLoading ? (
        <ul className='flex flex-col gap-12 mt-6'>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((element) => (
            <li className='ml-1 flex gap-4' key={element}>
              <div className='flex pr-8 h-8 w-8 animate-pulse items-center justify-center rounded-full bg-gray-300 font-medium' />
              <div className='flex gap-2 w-full'>
                <div className='mt-1 w-[50%] animate-pulse rounded-md bg-gray-300' />
                <div className='mt-1 w-[5%] h-3 animate-pulse rounded-md bg-gray-300' />
              </div>
              <div className='mt-1 mr-2 w-[6%] h-3 animate-pulse rounded-md bg-gray-300' />
            </li>
          ))}
        </ul>
      ) : (
        <ul className='relative ml-5'>
          {props.careerLog.map((item: CareerHistory, index: number) => (
            <li
              key={index}
              className={twMerge(
                'border-zinc-200 border-l h-20 flex items-center pl-8 text-sm',
                item.status === 'draft' && 'saturate-0',
              )}
            >
              {item.status === 'draft' && (
                <Badge variant='draft' className='border-dashed mr-1.5'>
                  Draft
                </Badge>
              )}
              <CareerLogTimelineItem
                careerLog={item}
                openDeleteLogModalHandler={props.openDeleteLogModalHandler}
                firstOrLast={
                  props.careerLog[0].id === item.id
                    ? 1
                    : props.careerLog[props.careerLog.length - 1].id === item.id
                    ? 0
                    : undefined
                }
                openLogInfoHandler={props.openLogInfoHandler}
                openEditLogInfoHandler={props.openEditLogInfoHandler}
                careerLogLength={props.careerLog.length}
                firstLogEntry={props.firstTypeOfLogEntry(props.careerLog, item)}
                organizationName={props.organizationName}
                employee={props.employee}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CareerLogTimeline;
