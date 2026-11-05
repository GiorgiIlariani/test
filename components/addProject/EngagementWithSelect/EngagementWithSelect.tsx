import { DownChevron } from 'components';
import React from 'react';
import { Props } from './types';
import { useEngagementWithSelect } from './useEngagementWithSelect';

const EngagementWithSelect: React.FC<Props> = (props) => {
  const { selectChangeHandler, selectPadding, register } = useEngagementWithSelect();
  return (
    <div className='flex relative items-center justify-between'>
      <span>Engagement</span>
      <select
        {...register('engagement_measurement_unit', {
          onChange(event) {
            selectChangeHandler(event);
          },
        })}
        disabled={props.isInShowMode}
        className={`h-fit text-left bg-none ${selectPadding} focus:ring-0 focus:border-transparent focus:outline-hidden font-medium text-xs p-0  text-slate-900 bg-transparent border-transparent`}
      >
        <option value='hr'>hr</option>
        <option value='day'>day</option>
      </select>
      {!props.isInShowMode && (
        <div className='pointer-events-none absolute top-0 right-0 flex h-full -translate-x-1/2 items-center justify-center'>
          <div className='pointer-events-none bg-indigo-50 py-2 px-1'>
            <DownChevron className='w-2' pathFill='#999DA5' />
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementWithSelect;
