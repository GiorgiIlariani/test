import { ErrorMessage } from '@hookform/error-message';
import { ExclamationCircle, InformationHover } from 'components';
import {
  capitalizeErrorMessage,
  getErrorMessage,
  simpleInputNeedUnfilledState,
  storeFieldInCookieObject,
} from 'helpers';
import React, { ChangeEvent } from 'react';
import { Props } from './types';
import { useInputWithRightText } from './useInputWithRightText';

const InputWithRightText: React.FC<Props> = (props) => {
  const { errors, getValues, register } = useInputWithRightText(props.inputName);
  const errorMessage = getErrorMessage(errors, props.inputName);

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <label
          htmlFor={props.inputName}
          className={`mb-2 block text-left text-sm font-medium text-gray-700 ${props.labelClasses}`}
        >
          {props.label}
        </label>
        {simpleInputNeedUnfilledState(getValues, props.inputName, props.needsUnfilledState) &&
          getValues(props.inputName) !== 0 && (
            <span className='text-right text-sm text-orange-500'>unfilled</span>
          )}
      </div>
      <div className={`relative rounded-md shadow-xs ${props.inputWrapperClasses}`}>
        <input
          type={props.type}
          className={`w-full border outline-hidden ${
            errorMessage
              ? 'border-red-300 shadow-red-500  outline-0 focus:border-transparent focus:shadow-xs focus:ring-2 focus:ring-red-500'
              : 'focus:ring-1 focus:ring-indigo-600 focus:border-transparent'
          } block w-full  pl-2 pr-12 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm  rounded-md ${
            props.className
          }`}
          placeholder={props.placeholder}
          {...register(props.inputName, {
            ...props.registerOptions,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              props.externalOnChangeHandler && props.externalOnChangeHandler(e);
              if (props.needsDraft) {
                storeFieldInCookieObject(
                  props.inputName,
                  (e.currentTarget as HTMLInputElement).value,
                  'add-employee',
                );
              }
            },
          })}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          /**
           * use form hook has 5 validation modes but you can not pick and choose 4 or 3 at time
           * you either pick all of them or one of them, i do not want to blur but i can not disable on init
           * so i turn it off by overriding it :)
           */
          onBlur={() => {}}
          min={props.min}
          disabled={props.canNotEdit}
          onKeyDown={props.externalKeyDownHandler}
        />
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-7'>
          {errorMessage ? (
            <ExclamationCircle />
          ) : (
            <span
              className={`sm:text-sm text-gray-500 ${props.rightTextClasses} `}
              id='price-currency'
            >
              {props.rightText}
            </span>
          )}
        </div>
        {props.informationText && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
            <InformationHover text={props.informationText} />
          </div>
        )}
      </div>
      <div
        className={`mt-1 min-h-4 text-left text-xs text-red-500 flex flex-col gap-1 ${props.errorBaseHeight}`}
      >
        <ErrorMessage render={capitalizeErrorMessage} name={props.inputName} errors={errors} />
        <div>{props.extraMessageBlock}</div>
      </div>
    </div>
  );
};

export default InputWithRightText;
