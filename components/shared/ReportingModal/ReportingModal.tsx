import React from 'react';
import { Backdrop } from 'components';
import { Props } from './types';
import { X } from 'components';

const ReportingModal: React.FC<Props> = (props) => {
  return (
    <>
      <Backdrop extraClasses='bg-slate-900/16! z-999999999' onClick={props.closeModal} />
      <div className='flex flex-col gap-4 bg-white w-96  z-99999999999999 fixed  rounded-md py-2 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]'>
        <div className='flex items-center justify-between px-4 '>
          <h3 className='font-bold'>{props.heading}</h3>
          <button onClick={props.closeModal}>
            <X />
          </button>
        </div>
        <p className='px-4 '>{props.text}</p>
        <nav className='flex gap-4 justify-end items-center border-t pt-2 px-4'>
          <button
            className='border border-zinc-200 font-normal text-sm px-4 py-1 rounded-md'
            onClick={props.closeModal}
          >
            {props.secondaryBtnText}
          </button>
          {props.btnText && (
            <button
              className={`${props.btnStyle} font-normal text-sm px-4 py-1 rounded-md`}
              onClick={props.submitModal}
            >
              {props.btnText}
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

export default ReportingModal;
