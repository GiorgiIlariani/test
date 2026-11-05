import React from 'react';
import { Props } from './types';

const Category: React.FC<Props> = (props) => {
  return (
    <div className='my-2 flex items-center  space-x-4'>
      {props.image}
      <button
        onClick={props.addNewCondition.bind(this, {
          type: 'topCategory',
          value: props.department.value,
          isIsNot: true,
          ConditionIsAnd: true,
          childConditions: [],
          filter_type: '',
          isChild: false,
          id: 0,
          shouldDefaultToAndInInsideCondition: false,
          department: props.department?.name,
        })}
        style={{
          backgroundColor: props.department.bg_color,
          color: props.department.text_color,
        }}
        className='rounded-md px-2 py-1 text-xs font-medium hover:opacity-80'
      >
        {props.department.name}
      </button>
    </div>
  );
};

export default Category;
