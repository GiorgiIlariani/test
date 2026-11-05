import React, { ForwardedRef } from 'react';
import { X } from 'components';
import { Props } from './types';
import { getTopCategory } from './helpers';
import { useSelectedFilter } from './useSelectedFilter';

const SelectedFilter: React.FC<Props> = React.forwardRef(
  (props, ref: ForwardedRef<HTMLDivElement>) => {
    const { switchConditionAnd, switchChildConditionAnd, switchConditionIs } = useSelectedFilter(
      props.fieldDetails,
      props.setFieldDetails,
    );

    const spaceRemovedIds = props.field.id.toString().replaceAll(' ', '_');
    const spaceRemovedType = props.field.type.replaceAll(' ', '_');
    const topCategory = getTopCategory(props.field, props.filterTopCategories);

    return (
      <div
        ref={ref}
        id={`selected-filter-${props.i}`}
        data-filter-id={props.field.id}
        data-filter-type={props.field.type}
        // selected-filter type is used for query selector be careful when removing
        className='flex h-8 selected-filter grow capitalize font-medium space-x-0.5 text-xs'
      >
        <div
          id={`selected-filter-start-${spaceRemovedIds}-${spaceRemovedType}`}
          className='flex h-full items-center shrink-0 space-x-0.5 text-xs'
        >
          {props.andBefore && (
            <button
              onClick={() => {
                switchConditionAnd({
                  type: (props.previousFilter ?? props.field).type,
                  value: (props.previousFilter ?? props.field).value,
                  id: (props.previousFilter ?? props.field).id,
                });
              }}
              className='shrink-0  px-2 text-indigo-600'
            >
              {(props.previousFilter ?? props.field).ConditionIsAnd ? 'And' : 'Or'}
            </button>
          )}
          <div
            style={{
              backgroundColor: topCategory?.bg_color,
            }}
            className='flex shrink-0 h-full text-gray-900 items-center space-x-2 rounded-l-md px-2 py-1'
          >
            {topCategory?.icon.default()}
            <span>{props.field.type.replaceAll('_', ' ')}</span>
          </div>
          <button
            onClick={() =>
              switchConditionIs({
                type: props.field.type,
                value: props.field.value,
                id: props.field.id,
              })
            }
            style={{
              backgroundColor: topCategory?.bg_color,
              color: topCategory?.text_color,
            }}
            className='h-full shrink-0 px-2 py-1'
          >
            {props.field.isIsNot ? 'is' : 'is not'}
          </button>
        </div>
        <div
          style={{
            backgroundColor: topCategory?.bg_color,
          }}
          onClick={() => {
            props.setAddingInsideSelectedFilter({
              type: props.field.type,
              value: props.field.value,
              meta: props.field.meta,
              id: props.field.id,
            });
            props.setSelectedField(props.field.type);
            props.filterOpenHandler();
            props.overflowToggleHandler();
          }}
          className='flex shrink-0 space-x-1 items-center px-2'
        >
          <span>{props.field.value}</span>
          {props.field.childConditions && (
            <span>
              {props.field.childConditions.map((filter, i) => (
                <span key={filter.value + i}>
                  {' '}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      switchChildConditionAnd(
                        {
                          type: props.field.type,
                          value: filter.value,
                          id: filter.id,
                        },
                        props.i,
                      );
                    }}
                    className='z-10 text-emerald-500'
                    type='button'
                  >
                    {filter.ConditionIsAnd ? 'and' : 'or'}
                  </button>{' '}
                  {filter.value}
                </span>
              ))}
            </span>
          )}
        </div>
        <button
          onClick={props.removeConditionHandler.bind(
            this,
            {
              type: props.field.type,
              value: props.field.value,
              id: props.field.id,
            },
            true,
          )}
          style={{
            backgroundColor: topCategory?.bg_color,
          }}
          id={`selected-filter-remove-${spaceRemovedIds}-${spaceRemovedType}`}
          className=' shrink-0 rounded-r-md px-2 py-1'
        >
          <X />
        </button>
        {props.fieldDetails[props.i + 1] && !props.andBefore && !props.nextFilterOverflows && (
          <button
            onClick={() => {
              switchConditionAnd({
                type: props.field.type,
                value: props.field.value,
                id: props.field.id,
              });
            }}
            className='shrink-0 px-2 font-medium text-indigo-600'
          >
            {props.field.ConditionIsAnd ? 'And' : 'Or'}
          </button>
        )}
      </div>
    );
  },
);

SelectedFilter.displayName = 'SelectedFilter';

export default SelectedFilter;
