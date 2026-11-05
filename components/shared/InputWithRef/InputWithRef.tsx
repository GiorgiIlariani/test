import { Props } from './types';
import React from 'react';
import { useInputWithRef } from './useInputWithRef';

const InputWithRef: React.FC<Props> = (props) => {
  const { registerValues, ref } = useInputWithRef(
    props.inputName,
    props.inputRef,
    props.registerOptions,
    props.externalOnChange,
    props.blurHandler,
  );

  return (
    <input
      {...registerValues}
      ref={(e) => {
        ref(e);
        (props.inputRef as any).current = e;
      }}
      className={`${props.className} text-sm`}
      placeholder={props.placeholder}
      onKeyDown={props.externalKeyDown}
    />
  );
};

export default InputWithRef;
