import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  BlueExclamationCircle,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components';
import { FormBaseProps } from '../types';

const FormBase: React.FC<FormBaseProps> = ({
  name,
  id,
  label,
  description,
  info,
  required = false,
  disabled = false,
  orientation = 'vertical',
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  rules,
  children,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          data-disabled={disabled}
          className={wrapperClassName}
          orientation={orientation}
        >
          {label && (
            <FieldLabel htmlFor={id ?? field.name} className={labelClassName}>
              {label}

              {required && <span className='text-destructive'>*</span>}

              {info && (
                <Tooltip>
                  <TooltipTrigger>
                    <BlueExclamationCircle className='size-3' />
                  </TooltipTrigger>

                  <TooltipContent onClick={(e) => e.stopPropagation()} className='shadow-xs'>
                    {info}
                  </TooltipContent>
                </Tooltip>
              )}
            </FieldLabel>
          )}

          {children({ field, fieldState })}

          {description && (
            <FieldDescription className={descriptionClassName}>{description}</FieldDescription>
          )}

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className={errorClassName} />
          )}
        </Field>
      )}
      rules={rules}
    />
  );
};

export default FormBase;
