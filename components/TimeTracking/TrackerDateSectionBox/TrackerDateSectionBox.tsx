import { formatDateWithWeekDayNames, getTermStatusIcon } from 'helpers';
import { PhaseStatusDialogForTimeTracker } from '../PhaseStatusDialogForTimeTracker';
import { Props } from './types';
import React, { useState } from 'react';

const TrackerDateSectionBox: React.FC<Props> = (props) => {
  const isFutureDate = new Date(props.date.date as string) > new Date();
  const [isBoxHovered, setIsBoxHovered] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

  return (
    <li
      ref={setReferenceElement}
      className={`${
        props.selectedDate === props.date.date ? 'border-indigo-600' : 'border-zinc-200'
      } ${props.date.date === new Date().toLocaleDateString('en-CA') ? 'bg-indigo-50' : ''} ${
        isFutureDate
          ? 'bg-gray-50 cursor-default'
          : 'cursor-pointer  hover:border-indigo-600 transition-all duration-300'
      } relative flex flex-col text-[#2C2B23] items-center justify-center border rounded-md py-[0.313rem] w-full min-w-20`}
      onClick={() => !isFutureDate && props.setSelectedDate(props.date.date)}
      onMouseOver={() => setIsBoxHovered(true)}
      onMouseLeave={() => setIsBoxHovered(false)}
    >
      {!(isBoxHovered && props.projects.length) || (
        <PhaseStatusDialogForTimeTracker
          setIsBoxHovered={setIsBoxHovered}
          isBoxHovered={isBoxHovered}
          projects={props.projects}
          referenceElement={referenceElement}
        />
      )}

      <p className='font-bold text-sm'>
        {!props.isLoading ? (
          props.date.minutes ? (
            `${props.date.hours}h ${props.date.minutes}m`
          ) : (
            `${props.date.hours}h`
          )
        ) : (
          <div className='w-12 h-5 bg-gray-300 animate-pulse rounded-sm' />
        )}
      </p>

      <p className='text-xs'>{formatDateWithWeekDayNames(props.date.date as string)}</p>

      <div className='absolute top-1 right-1'>{getTermStatusIcon(props.date.status)}</div>
    </li>
  );
};

export default TrackerDateSectionBox;
