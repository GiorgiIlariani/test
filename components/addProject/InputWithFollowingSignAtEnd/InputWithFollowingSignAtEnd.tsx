import React, { ChangeEvent, MouseEvent } from 'react';
import { Props } from './types';
import { useInputWithFollowingSignAtEnd } from './useInputWithFollowingSignAtEnd';
import { ErrorMessage } from '@hookform/error-message';
import { capitalizeErrorMessage } from 'helpers';

const InputWithFollowingSignAtEnd: React.FC<Props> = (props) => {
  const { changeAndBlurHandler, measureSpanRef, inputValue, width, register, errors } =
    useInputWithFollowingSignAtEnd(
      props.inputName,
      props.doNotCutSize,
      props.placeholder,
      props.allowFloats,
    );

  return (
    <>
      <div className={`w-full ${props.className} flex items-center justify-start relative`}>
        <input
          type='number'
          {...register(props.inputName, {
            onChange(event: ChangeEvent<HTMLInputElement>) {
              props.changeEvent?.(event);
              changeAndBlurHandler(event);
            },
            onBlur(event: MouseEvent<HTMLInputElement>) {
              props.blurEvent?.(event);
              changeAndBlurHandler(event);
            },
            ...props.registerOptions,
          })}
          id={`${props.inputName}`}
          placeholder={props.placeholder}
          disabled={props.isInShowMode}
          min={props.min ?? 0}
          max={props.max}
          step={'any'}
          style={{
            width: `${width < 20 ? 25 : width}px`,
          }}
          onKeyDown={props.externalKeyDownHandler}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          className={`w-full bg-transparent border max-w-[90%] hide-number-arrows peer h-full p-0 pb-0.5 text-zinc-700  outline-hidden ring-0 ${
            props.isInShowMode
              ? 'disabled:text-zinc-700 border-transparent disabled:bg-transparent'
              : 'disabled:bg-gray-50 disabled:text-gray-500'
          } border-transparent focus-within:border-transparent focus-within:outline-transparent focus-within:ring-0 focus:border-transparent focus:outline-transparent focus:ring-0`}
        />
        <span className={`text-zinc-700 peer-focus:text-zinc-700/70 ${props.signClasses}`}>
          {props.sign}
        </span>
        <span
          ref={measureSpanRef}
          className='absolute text-lg border-transparent focus:border-transparent focus:outline-transparent focus:ring-0 -left-[600vw] p-0 pb-0.5 -top-[700vw]'
        >
          {inputValue && inputValue != '0' ? inputValue : props.placeholder}
        </span>
      </div>
      {props.renderError && (
        <div className='mt-1 min-h-4 text-left text-xs text-red-500 flex flex-col gap-1'>
          <ErrorMessage render={capitalizeErrorMessage} name={props.inputName} errors={errors} />
        </div>
      )}
    </>
  );
};

export default InputWithFollowingSignAtEnd;
