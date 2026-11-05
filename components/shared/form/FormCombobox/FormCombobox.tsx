import React, { useState } from 'react';
import {
  FormBase,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from 'components';
import { FormComboboxProps } from './types';

const FormCombobox: React.FC<FormComboboxProps> = ({
  name,
  label,
  description,
  info,
  emptyText = 'No items found.',
  creatable = false,
  items,
  inputValue,
  disabled = false,
  required = false,
  showClear = false,
  showTrigger = true,
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  inputClassName,
  inputWrapperClassName,
  contentClassName,
  onValueChange,
  onCreateClick,
  onInputValueChange,
  rules,
  ...comboboxInputProps
}) => {
  const [internalInputValue, setInternalInputValue] = useState('');
  const isInputControlled = inputValue !== undefined;
  const shouldUseInternalInput = creatable && !isInputControlled;
  const currentInputValue = inputValue ?? internalInputValue;

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
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
      rules={rules}
    >
      {({ field, fieldState }) => {
        const selectedItem = items.find((item) => item.value === field.value) ?? null;

        return (
          <Combobox
            key={`${field.name}-${selectedItem?.value ?? 'empty'}`}
            name={field.name}
            value={selectedItem}
            items={items}
            inputValue={isInputControlled ? currentInputValue : undefined}
            itemToStringLabel={(item) => item.label}
            itemToStringValue={(item) => String(item.value)}
            onValueChange={(item, e) => {
              if (shouldUseInternalInput) {
                setInternalInputValue('');
              }

              field.onChange(item ? item.value : null);
              onValueChange?.(item, e);
            }}
            onInputValueChange={(nextInputValue, e) => {
              if (shouldUseInternalInput) {
                setInternalInputValue(nextInputValue);
              }

              onInputValueChange?.(nextInputValue, e);
            }}
            disabled={disabled}
          >
            <ComboboxInput
              {...comboboxInputProps}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              required={required}
              showClear={showClear}
              showTrigger={showTrigger}
              className={inputWrapperClassName}
              inputClassName={inputClassName}
            />

            <ComboboxContent className={contentClassName}>
              <ComboboxEmpty className={creatable ? 'p-1' : ''}>
                {creatable ? (
                  <button
                    type='button'
                    className='w-full px-1.5 py-1 rounded-md hover:bg-accent text-start'
                    onClick={(event) => onCreateClick?.(currentInputValue, event)}
                  >
                    Create new{' '}
                    <span className='text-primary bg-primary-foreground px-1.5 rounded wrap-break-word'>
                      {currentInputValue}
                    </span>
                  </button>
                ) : (
                  emptyText
                )}
              </ComboboxEmpty>

              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FormBase>
  );
};

export default FormCombobox;
