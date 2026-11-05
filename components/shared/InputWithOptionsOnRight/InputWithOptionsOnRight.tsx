import {
  ExclamationCircle,
  DownChevron,
  InformationHover,
  BlueExclamationCircle,
} from 'components';
import { getErrorMessage, storeFieldInCookieObject } from 'helpers';
import React, { ChangeEvent } from 'react';
import { Props } from './types';
import { useInputWithOptionsOnRight } from './useInputWithOptionsOnRight';
import { twMerge } from 'tailwind-merge';

const InputWithOptionsOnRight: React.FC<Props> = (props) => {
  const { errors, getValues, input, register, select } = useInputWithOptionsOnRight(
    props.inputName,
    props.selectName,
  );
  return (
    <label className={`${props.containerClasses} h-full w-full`}>
      {!props.noLabel && (
        <div className='flex items-center gap-2'>
          <span className='mb-1 block text-sm font-medium text-slate-900!'>{props.labelName}</span>

          {!!props.infoText && (
            <div className='group relative inline-flex -translate-y-[0.2rem]'>
              <BlueExclamationCircle width='14' height='14' className='cursor-pointer' />

              <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 hidden -translate-x-1/2 group-hover:flex'>
                <div
                  className={twMerge(
                    `flex w-60 flex-col gap-2 rounded-md border border-gray-100 bg-white p-3 text-xs text-gray-700 shadow-xs`,
                  )}
                >
                  {props.infoText}
                </div>
                <div className='absolute -bottom-2 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rotate-45 rounded-br-md border border-t-0 border-l-0 border-gray-100 bg-white shadow-xs' />
              </div>
            </div>
          )}
        </div>
      )}
      {props.loading ? (
        <div
          className={twMerge('h-12 animate-pulse rounded-md bg-zinc-200', props.extraLoaderClasses)}
        ></div>
      ) : (
        <div className={`relative flex h-12 w-full ${props.wrapperClasses}`}>
          <input
            className={`w-full border focus:border-none focus:ring-indigo-600 ${
              typeof getErrorMessage(errors, props.inputName) === 'string' &&
              'border-red-300  shadow-red-500 outline-0 focus:border-transparent focus:shadow-xs focus:ring-2 focus:ring-red-500'
            } disabled:bg-gray-50 ${
              props.className
            } pr-22 disabled:text-gray-500 placeholder:text-zinc-400 placeholder:text-sm placeholder:tracking-tight ${
              props.needsUnfilledState && !getValues(props.inputName) && !getValues(props.inputName)
                ? 'border-orange-500'
                : 'border-zinc-200'
            } rounded-md py-2 px-4`}
            type={props.type}
            value={input}
            onKeyDown={props.externalKeyDownHandler}
            min={`${props.numberMin}`}
            {...register(props.inputName, {
              ...props.registerOptions,
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                props.externalOnChange && props.externalOnChange(e);
                if (props.needsDraft) {
                  storeFieldInCookieObject(
                    props.inputName,
                    (e.currentTarget as HTMLInputElement).value,
                    'add-employee',
                  );
                }
              },
            })}
            placeholder={props.placeholder}
            /**
             * use form hook has 5 validation modes but you can not pick and choose 4 or 3 at time
             * you either pick all of them or one of them, i do not want to blur but i can not disable on init
             * so i turn it off by overriding it :)
             */
            onBlur={(e) => {
              props.blurHandler?.(e);
            }}
            disabled={props.canNotEdit}
          />
          {typeof getErrorMessage(errors, props.inputName) === 'string' && (
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[4.1rem]'>
              <div className='flex h-fit items-center bg-white'>
                <ExclamationCircle />
              </div>
            </div>
          )}
          <div className='absolute top-0 right-0 flex  h-full items-center justify-center'>
            <select
              {...register(props.selectName, {
                deps: [props.inputName],
              })}
              onBlur={(e) => {
                props.blurHandler?.(e);
              }}
              value={select ?? 'GEL'}
              disabled={props.canNotEdit}
              className={`h-10 ${props.optionClassName} ${
                props.canNotEdit && 'appearance-none bg-none opacity-100'
              } tracking-tight bg-none p-0 text-indigo-600 rounded-md border-0 border-transparent bg-transparent py-0 pl-2 pr-7 text-sm outline-hidden ring-0 focus:outline-hidden focus:ring-0`}
            >
              {props.selectOptions.map((currency) => (
                <option
                  key={currency.text}
                  value={currency.value}
                  className='text-indigo-600 text-sm'
                >
                  {currency.text}
                </option>
              ))}
            </select>
          </div>
          {props.changeArrowColor && (
            <div className='pointer-events-none absolute top-0 right-0 flex h-full -translate-x-1/2 items-center justify-center'>
              <div className='pointer-events-none bg-transparent py-2 px-1'>
                <DownChevron pathFill={props.changeArrowColor} />
              </div>
            </div>
          )}
          {props.informationText && props.canNotEdit && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <InformationHover text={props.informationText} />
            </div>
          )}
        </div>
      )}
      <div
        className={`text-red-500 ${!props.doNotLeavePlaceForError && 'h-4 mt-1 min-h-4'} ${
          props.errorClasses
        } text-2xs`}
      >
        {getErrorMessage(errors, props.inputName)}
      </div>
    </label>
  );
};

export default InputWithOptionsOnRight;
