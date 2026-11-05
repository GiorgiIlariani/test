import React from 'react';
import {
  FormBase,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from 'components';
import { FormInputGroupProps } from './types';

const FormInputGroup: React.FC<FormInputGroupProps> = ({
  name,
  label,
  description,
  icon,
  onIconClick,
  alignIcon = 'inline-end',
  required = false,
  disabled = false,
  autoComplete = 'off',
  spellCheck = 'false',
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
      label={label}
      description={description}
      required={required}
      disabled={disabled}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      rules={rules}
    >
      {({ field, fieldState }) => (
        <InputGroup>
          <InputGroupInput
            {...inputProps}
            {...field}
            onChange={(event) => {
              field.onChange(event);
              customOnChange?.(event);
            }}
            id={field.name}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            className={inputClassName}
          />

          {icon && (
            <InputGroupAddon align={alignIcon} aria-invalid={fieldState.invalid}>
              {onIconClick ? (
                <InputGroupButton onClick={onIconClick}>{icon}</InputGroupButton>
              ) : (
                icon
              )}
            </InputGroupAddon>
          )}
        </InputGroup>
      )}
    </FormBase>
  );
};

export default FormInputGroup;
