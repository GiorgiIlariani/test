import { InfoCircle } from 'components';
import { getCurrencySymbol } from 'helpers';
import React from 'react';
import { Props } from './types';
import { useEmployeeTotal } from './useEmployeeTotal';

const EmployeeTotal: React.FC<Props> = (props) => {
  const { currency, formatter, formState, updatedTotal } = useEmployeeTotal(props.inputNameStart);

  return (
    <span>
      {(props.showProject &&
        !props.isInShowMode &&
        (formState.dirtyFields?.staffs?.[props.i]?.rate ||
          formState.dirtyFields?.staffs?.[props.i]?.engagement ||
          formState.dirtyFields?.staffs?.[props.i]?.is_free_of_charge ||
          formState.dirtyFields?.start_date)) ||
      props.recalculateInEdit ? (
        <span className='text-zinc-950 flex items-center space-x-1 text-xs'>
          <span className='text-sm flex'>{formatter.format(updatedTotal!)}</span>
          {props.renderInfo && (
            <div className='group relative before:absolute before:-top-1 before:z-10 before:hidden before:h-2.5 before:w-2.5 before:translate-x-1/2  before:-translate-y-full before:rotate-45 before:border-r before:border-b before:border-gray-300 before:bg-indigo-50 before:content-[""] hover:before:block'>
              <div className='absolute -top-2 hidden -translate-x-[10%] -translate-y-full whitespace-nowrap rounded-lg border border-gray-300 bg-indigo-50 p-2 text-indigo-900 group-hover:block'>
                Submit changes to view total
              </div>
              <InfoCircle className='h-5 w-5 cursor-pointer' />
            </div>
          )}
        </span>
      ) : (
        <div className='flex items-center truncate'>
          {getCurrencySymbol(currency)}
          {formatter
            .format(
              props.isInShowMode
                ? +(props.termData?.staffs?.[props.i]?.total as number)
                : updatedTotal!,
            )
            .replaceAll(/(\$|€|£|\s|GEL|₾)/g, '')
            .trim()}
        </div>
      )}
    </span>
  );
};

export default EmployeeTotal;
