import { Reject } from 'components/icons';
import { Props } from './types';
import React from 'react';

const RejectButton: React.FC<Props> = (props) => {
  return (
    <button
      type='button'
      disabled={props.disabled}
      className={`${
        props.rejected
          ? 'border flex gap-2 items-center border-[#DC2626] text-[#DC2626]'
          : 'border bg-[#DC2626] text-white hover:bg-red-500'
      } transition-150-ease-in ${
        props.grayDisabled && 'disabled:bg-gray-300 disabled:cursor-not-allowed'
      } py-1.5 px-3 rounded-md`}
      onClick={props.onClick}
    >
      {props.rejected && <Reject />}
      {props.rejected ? 'Rejected' : 'Reject'}
    </button>
  );
};

export default RejectButton;
