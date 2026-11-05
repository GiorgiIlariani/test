import { Checkbox, FormBase } from 'components';
import { FormCheckboxProps } from './types';
import { cn } from 'lib';

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  description,
  required = false,
  disabled = false,
  orientation = 'horizontal',
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  checkboxClassName,
  onCheckedChange: customOnCheckedChange,
  rules,
}) => {
  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      required={required}
      disabled={disabled}
      orientation={orientation}
      wrapperClassName={wrapperClassName}
      labelClassName={cn('order-2', labelClassName)}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
      rules={rules}
    >
      {({ field, fieldState }) => (
        <Checkbox
          id={field.name}
          name={field.name}
          checked={field.value}
          onCheckedChange={(checked) => {
            field.onChange(checked);
            customOnCheckedChange?.(checked);
          }}
          aria-invalid={fieldState.invalid}
          disabled={disabled}
          required={required}
          className={checkboxClassName}
        />
      )}
    </FormBase>
  );
};

export default FormCheckbox;
