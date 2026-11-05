import React from 'react';
import {
  FormBase,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components';
import { FormSelectProps } from './types';

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  description,
  placeholder,
  items,
  onChangeHandler,
  disabled = false,
  required = false,
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  triggerClassName,
  contentClassName,
  side,
  align,
  alignItemWithTrigger = false,
  chevronInheritsColor,
  hideChevron,
  rules,
  ...selectProps
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
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
      rules={rules}
    >
      {({ field, fieldState }) => (
        <Select
          {...selectProps}
          name={field.name}
          value={field.value ?? null}
          onValueChange={(value) => {
            field.onChange(value);
            onChangeHandler?.(value as string | number);
          }}
          items={items}
          disabled={disabled}
        >
          <SelectTrigger
            id={field.name}
            aria-invalid={fieldState.invalid}
            hideChevron={hideChevron}
            chevronInheritsColor={chevronInheritsColor}
            className={triggerClassName}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent
            side={side}
            align={align}
            alignItemWithTrigger={alignItemWithTrigger}
            className={contentClassName}
          >
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </FormBase>
  );
};

export default FormSelect;
