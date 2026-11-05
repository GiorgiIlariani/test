import React from 'react';
import { FormBase, DatePicker } from 'components';
import { formatDateForBack } from 'helpers';
import { FormDatePickerProps } from './types';

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  description,
  required = false,
  disabled = false,
  wrapperClassName,
  labelClassName,
  onSelect: customOnSelect,
  rules,
  ...datePickerProps
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
        <DatePicker
          {...datePickerProps}
          id={field.name}
          date={field.value ? new Date(field.value) : undefined}
          onSelect={(date) => {
            field.onChange(date ? formatDateForBack(date) : '');
            customOnSelect?.(date);
          }}
          required={required}
          disabled={disabled}
          aria-invalid={fieldState.invalid}
        />
      )}
    </FormBase>
  );
};

export default FormDatePicker;
