import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Props } from './types';

const FreeOfChargeToggle: React.FC<Props> = (props) => {
  const { register } = useFormContext();
  return (
    <div className='flex items-center space-x-4'>
      <label
        htmlFor={`${props.inputName}-${props.pageUniquePart}`}
        className='relative mx-auto h-6 w-10 cursor-pointer disabled:cursor-auto select-none justify-self-center rounded-2xl'
      >
        <input
          id={`${props.inputName}-${props.pageUniquePart}`}
          className='peer opacity-0'
          type='checkbox'
          {...register(props.inputName, {
            onChange(event) {
              props.onChangeHandler?.(event);
            },
          })}
          disabled={props.showProject}
          defaultChecked={props.defaultValue as boolean}
          {...(props.checked !== undefined ? { checked: props.checked as boolean } : {})}
        />
        <div
          className={`${props.showProject ? 'cursor-auto' : 'cursor-pointer'} ${
            props.showProject
              ? 'bg-gray-100 peer-checked:bg-[#A7F3D0]'
              : 'bg-zinc-200 peer-checked:bg-success'
          } transition-150-ease-in absolute top-0 left-0 h-full w-full rounded-2xl hover:bg-gray-200 hover:text-indigo-800`}
        />
        <div
          className={`${
            props.showProject ? 'cursor-auto' : 'cursor-pointer'
          } transition-150-ease-in absolute left-0.5 top-1/2 -translate-y-1/2 flex  h-5.25 w-5.25 peer-checked:left-[calc(100%-1.4375rem)] items-center justify-center overflow-hidden rounded-full bg-white shadow-2xl`}
        />
      </label>
    </div>
  );
};

export default FreeOfChargeToggle;
