import { TransparentRedberryLogo } from 'components';
import React from 'react';
import { Props } from './types';

const WhiteLabelRedberryToggle: React.FC<Props> = (props) => {
  return (
    <div className='flex items-center  space-x-4'>
      <span
        className={`${
          !props.whiteLabelChecked ? 'text-redberry-red' : 'font-medium text-slate-900'
        } transition-150-ease-in cursor-pointer font-medium`}
        onClick={props.checkRDBR}
      >
        RDBR
      </span>
      <label
        htmlFor={`${props.i}-label-variant_${props.uniqueId}`}
        className='relative mx-auto h-[25px] w-[40px] cursor-pointer select-none self-center  justify-self-center rounded-2xl bg-redberry-red'
      >
        <input
          id={`${props.i}-label-variant_${props.uniqueId}`}
          checked={props.whiteLabelChecked}
          className='peer opacity-0'
          type='checkbox'
          onChange={props.labelChoiceChangeHandler}
          {...props.register?.('variant', {
            onChange: props.labelChoiceChangeHandler,
          })}
        />
        <div className='transition-150-ease-in h-full w-full rounded-2xl '></div>
        <div className='transition-150-ease-in absolute left-[2%] top-[5%] flex h-[23px]  w-[23px] items-center justify-center overflow-hidden   rounded-full bg-redberry-red shadow-2xl peer-checked:left-[40%] peer-checked:bg-white'>
          {props.whiteLabelChecked ? '' : <TransparentRedberryLogo />}
        </div>
      </label>
      <span
        className={`${
          props.whiteLabelChecked ? 'text-redberry-red' : 'text-slate-900 '
        } transition-150-ease-in cursor-pointer font-medium`}
        onClick={props.checkWhiteLabel}
      >
        White label
      </span>
    </div>
  );
};

export default WhiteLabelRedberryToggle;
