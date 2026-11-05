import { Props } from './types';
import React from 'react';
import { useTransformedInput } from './useTransformedInput';

const TransformedInput: React.FC<Props> = (props) => {
  const {
    registerValues,
    isInputFocused,
    inputRef,
    ref,
    getValues,
    customButtonOndEditMode,
    toggleCustomButton,
  } = useTransformedInput(
    props.inputName,
    props.registerOptions,
    props.externalOnChange,
    props.blurHandler,
  );

  return (
    <div className={`${props.containerClasses} relative`}>
      <div
        onClick={() => !props.canNotEdit && toggleCustomButton()}
        className={` ${customButtonOndEditMode || isInputFocused ? 'hidden' : ''} ${
          props.externalButtonClassName
        } ${
          props.canNotEdit ? 'cursor-default' : 'cursor-text'
        } absolute top-[0.18rem] z-10 text-sm w-full `}
      >
        {props.displayValue ?? Math.round(getValues(props.inputName))}
      </div>
      <input
        {...registerValues}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        className={`${props.className} ${
          !customButtonOndEditMode && !isInputFocused ? 'opacity-0' : 'opacity-100'
        }  text-sm focus:outline-1 focus:outline-solid focus:ring-indigo-600 focus:border-transparent`}
        placeholder={props.placeholder}
        onKeyDown={props.externalKeyDown}
        disabled={props.canNotEdit}
      />
    </div>
  );
};

export default TransformedInput;
