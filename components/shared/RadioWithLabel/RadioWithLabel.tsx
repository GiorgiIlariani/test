import { storeFieldInCookieObject } from 'helpers';
import React, { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Props } from './types';
import { twMerge } from 'tailwind-merge';

const RadioWithLabel: React.FC<Props> = (props) => {
  const { register } = useFormContext();
  return (
    <div
      className={twMerge('h-full w-full', props.wrapperClasses, props.isControlled && 'relative')}
      onClick={props.onClick}
    >
      <label className='flex w-fit items-center' htmlFor={props.value}>
        {props.isControlled && (
          <input
            type='radio'
            className='opacity-0 z-20 w-full h-full absolute inset-0 cursor-pointer'
          />
        )}
        <input
          type='radio'
          {...register(props.inputName, {
            ...props.registerOptions,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              props.externalChangeHandler?.(e);
              if (props.needsDraft) {
                storeFieldInCookieObject(
                  props.inputName,
                  (e.currentTarget as HTMLInputElement).value,
                  'add-employee',
                );
              }
            },
          })}
          id={props.value}
          className={twMerge(
            'my-2 mr-2 hover:bg-gray-200 cursor-pointer',
            props.canNotEdit
              ? 'text-[#4F46E5] opacity-30 cursor-normal'
              : 'text-indigo-600 hover:text-indigo-800',
            props.inputClasses,
          )}
          value={props.value}
          defaultChecked={props.defaultChecked}
          disabled={props.canNotEdit || props.isControlled}
        />
        <span
          className={`${
            !props.labelClasses && 'text-sm font-medium'
          } text-gray-700 capitalize cursor-pointer ${props.labelClasses}`}
        >
          {props.label}
        </span>
      </label>
    </div>
  );
};

export default RadioWithLabel;
