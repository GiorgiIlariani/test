import React from 'react';
import { FormBase, FormSelect, InputGroup, InputGroupAddon, InputGroupInput } from 'components';
import { FormInputWithOptionsProps } from './types';
import { cn } from 'lib';

const FormInputWithOptions: React.FC<FormInputWithOptionsProps> = ({
  name,
  optionName,
  options,
  optionsTriggerClassName,
  optionsContentClassName,
  label,
  description,
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

          <InputGroupAddon align='inline-end'>
            <FormSelect
              name={optionName}
              items={options}
              triggerClassName={cn('text-primary border-none p-0', optionsTriggerClassName)}
              contentClassName={cn('text-primary w-auto', optionsContentClassName)}
            />
          </InputGroupAddon>
        </InputGroup>
      )}
    </FormBase>
  );
};

export default FormInputWithOptions;
