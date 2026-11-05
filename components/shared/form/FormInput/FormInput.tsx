import React from 'react';
import { FormBase, Input } from 'components';
import { FormInputProps } from './types';

const FormInput: React.FC<FormInputProps> = ({
  name,
  id,
  label,
  description,
  info,
  required = false,
  disabled = false,
  autoComplete = 'off',
  spellCheck = 'false',
  orientation = 'vertical',
  wrapperClassName,
  labelClassName,
  inputClassName,
  onChange: customOnChange,
  rules,
  ...inputProps
}) => {
  return (
    <FormBase
      name={name}
      id={id}
      label={label}
      description={description}
      info={info}
      required={required}
      disabled={disabled}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      orientation={orientation}
      rules={rules}
    >
      {({ field, fieldState }) => (
        <Input
          {...inputProps}
          {...field}
          onChange={(event) => {
            field.onChange(event);
            customOnChange?.(event);
          }}
          id={id ?? field.name}
          aria-invalid={fieldState.invalid}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          className={inputClassName}
        />
      )}
    </FormBase>
  );
};

export default FormInput;
