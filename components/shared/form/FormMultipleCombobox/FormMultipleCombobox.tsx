import React, { useState } from 'react';
import {
  FormBase,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxChips,
  ComboboxValue,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from 'components';
import { FormMultipleComboboxProps } from './types';

const FormMultipleCombobox = <T extends Record<string, any>>({
  name,
  label,
  description,
  emptyText = 'No items found.',
  creatable = false,
  items,
  itemToLabel = (item) => item.label ?? item.title,
  itemToValue = (item) => item.value ?? item.id,
  inputValue,
  disabled = false,
  required = false,
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  inputClassName,
  contentClassName,
  onValueChange,
  onCreateClick,
  onInputValueChange,
  rules,
  ...comboboxInputProps
}: FormMultipleComboboxProps<T>) => {
  const anchor = useComboboxAnchor();

  const [internalInputValue, setInternalInputValue] = useState('');
  const isInputControlled = inputValue !== undefined;
  const shouldUseInternalInput = creatable && !isInputControlled;
  const currentInputValue = inputValue ?? internalInputValue;

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
      {({ field, fieldState }) => {
        const selectedItems = Array.isArray(field.value)
          ? field.value.map((valObj) => {
              const id = typeof valObj === 'object' ? itemToValue(valObj) : valObj;

              return items.find((item) => String(itemToValue(item)) === String(id)) || valObj;
            })
          : [];

        return (
          <Combobox
            multiple
            name={field.name}
            value={selectedItems}
            items={items}
            inputValue={isInputControlled ? currentInputValue : undefined}
            itemToStringLabel={(item) => itemToLabel(item)}
            itemToStringValue={(item) => String(itemToValue(item))}
            onValueChange={(values, e) => {
              if (shouldUseInternalInput) {
                setInternalInputValue('');
              }

              field.onChange(values);
              onValueChange?.(values as any, e);
            }}
            onInputValueChange={(nextInputValue, e) => {
              if (shouldUseInternalInput) {
                setInternalInputValue(nextInputValue);
              }

              onInputValueChange?.(nextInputValue, e);
            }}
            disabled={disabled}
          >
            <ComboboxChips ref={anchor}>
              <ComboboxValue>
                {(comboboxItems) => (
                  <>
                    {comboboxItems.map((item: any) => (
                      <ComboboxChip key={itemToValue(item)}>{itemToLabel(item)}</ComboboxChip>
                    ))}

                    <ComboboxChipsInput
                      {...comboboxInputProps}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      disabled={disabled}
                      required={required}
                      className={inputClassName}
                    />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>

            <ComboboxContent anchor={anchor} className={contentClassName}>
              <ComboboxEmpty className={creatable ? 'p-1' : ''}>
                {creatable ? (
                  <button
                    type='button'
                    className='w-full px-1.5 py-1 rounded-md hover:bg-accent text-start'
                    onClick={(event) => onCreateClick?.(currentInputValue ?? '', event)}
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
                  <ComboboxItem key={itemToValue(item)} value={item}>
                    {itemToLabel(item)}
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

export default FormMultipleCombobox;
