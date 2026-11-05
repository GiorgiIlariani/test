import { Delete, Export, FolderWithStrokes } from 'components/icons';
import React from 'react';
import { Props } from './types';
import { Loader } from 'components/shared';

const ActionButton: React.FC<Props> = (props) => {
  return (
    <div className={`${props.className} bg-white hover:bg-[#e6e7e9]`}>
      <div className='flex items-center justify-center gap-2 text-sm'>
        {props.isLoading ? (
          <div className='pl-1'>
            <Loader size='16px' border='2px' />
          </div>
        ) : props.icon === 'pdf' ? (
          <FolderWithStrokes />
        ) : props.icon === 'csv' ? (
          <Export />
        ) : (
          props.icon === 'delete' && <Delete pathClassName={props.iconPathClassName} />
        )}
        {props.buttonText}
      </div>
    </div>
  );
};

export default ActionButton;
