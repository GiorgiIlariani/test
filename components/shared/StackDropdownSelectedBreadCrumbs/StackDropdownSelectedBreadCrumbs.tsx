import { DeleteX } from 'components/icons';
import React from 'react';
import { Props } from './types';
import { Skill } from 'types';

const StackDropdownSelectedBreadCrumbs: React.FC<Props> = (props) => {
  return (
    <>
      {props.selectedStack.map((stack, i) => (
        <div
          key={stack.id || i}
          onClick={() => {
            props.deleteHandler(props.selectedStack[i]);
            props.allInputsChangeHandler &&
              props.allInputsChangeHandler(props.selectedStack[i] as Skill);
          }}
          style={{
            background: stack.color ?? 'rgb(249 250 251)',
          }}
          className={`delete_btn  my-2 flex items-center space-x-2 whitespace-nowrap  py-0.5 pl-1 pr-2 text-sm text-gray-500 ${props.extraBreadCrumbClasses}`}
          tabIndex={0}
        >
          <span className='pointer-events-none'>{props.selectedStack[i].title}</span>
          {!props.canNotEdit && props.isOpen && props.doesNotNeedRemoveXOnNotOpen && <DeleteX />}
        </div>
      ))}
    </>
  );
};

export default StackDropdownSelectedBreadCrumbs;
