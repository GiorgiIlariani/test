import { Approved } from 'components/icons';
import { Props } from './types';
import React from 'react';

const ApproveButton: React.FC<Props> = (props) => {
  return (
    <button
      type='submit'
      disabled={props.disabled}
      className={`${
        props.approved
          ? 'text-[#059669] flex gap-2 items-center bg-[#ECFDF5]'
          : 'text-white bg-indigo-600 hover:bg-indigo-800'
      } transition-150-ease-in ${
        props.grayDisabled && 'disabled:bg-gray-300! disabled:cursor-not-allowed'
      }   h-full px-3 rounded-md py-2 text-base fo`}
      onClick={props.onClick}
    >
      {props.approved && <Approved />}
      {props.approved ? 'Approved' : 'Approve'}
    </button>
  );
};

export default ApproveButton;
