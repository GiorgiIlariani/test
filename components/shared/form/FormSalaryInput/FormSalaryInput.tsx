import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormBase, FormSelect, InputGroup, InputGroupAddon, InputGroupInput } from 'components';
import { DollarSignIcon, EuroIcon, GeorgianLariIcon, PoundSterlingIcon } from 'lucide-react';
import { CURRENCIES } from 'config';
import { FormSalaryInputProps } from './types';
import { cn } from 'lib';

const FormSalaryInput: React.FC<FormSalaryInputProps> = ({
  name,
  currencyName,
  hideCurrencySelect = false,
  label,
  description,
  info,
  required = false,
  disabled = false,
  autoComplete = 'off',
  spellCheck = 'false',
  wrapperClassName,
  labelClassName,
  currencyTriggerClassName,
  currencyContentClassName,
  externalOnChange,
  rules,
  ...inputProps
}) => {
  const { watch } = useFormContext();

  const selectedCurrency = watch(currencyName) || CURRENCIES[0].value;
  const currencyIconMap: Record<string, React.ComponentType<any>> = {
    USD: DollarSignIcon,
    EUR: EuroIcon,
    GBP: PoundSterlingIcon,
    GEL: GeorgianLariIcon,
  };
  const CurrencyIcon = currencyIconMap[selectedCurrency] ?? DollarSignIcon;

  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      info={info}
      required={required}
      disabled={disabled}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      rules={rules}
    >
      {({ field, fieldState }) => (
        <InputGroup>
          <InputGroupAddon>
            <CurrencyIcon />
          </InputGroupAddon>

          <InputGroupInput
            {...inputProps}
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            onChange={(event) => {
              field.onChange(event);
              externalOnChange?.(event);
            }}
          />

          {!hideCurrencySelect && (
            <InputGroupAddon align='inline-end'>
              <FormSelect
                name={currencyName}
                items={CURRENCIES.map((c) => ({ value: c.value, label: c.text }))}
                triggerClassName={cn('border-none p-0', currencyTriggerClassName)}
                contentClassName={cn('w-auto', currencyContentClassName)}
              />
            </InputGroupAddon>
          )}
        </InputGroup>
      )}
    </FormBase>
  );
};

export default FormSalaryInput;
