import React from 'react';
import {
  FormBase,
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from 'components';
import { FormGroupedComboboxProps } from './types';

const FormGroupedCombobox: React.FC<FormGroupedComboboxProps> = ({
  name,
  label,
  description,
  items,
  disabled = false,
  required = false,
  wrapperClassName,
  labelClassName,
  ...comboboxInputProps
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
    >
      {({ field, fieldState }) => {
        const selectedItem =
          items.flatMap((group) => group.items).find((item) => item.value === field.value) ?? null;

        return (
          <Combobox
            name={field.name}
            value={selectedItem}
            onValueChange={(item) => {
              field.onChange(item ? item.value : null);
            }}
            items={items}
            itemToStringValue={(item) => item.label}
            disabled={disabled}
            required={required}
          >
            <ComboboxInput
              {...comboboxInputProps}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              required={required}
            />

            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(group, index) => (
                  <ComboboxGroup key={group.label} items={group.items}>
                    <ComboboxLabel>{group.label}</ComboboxLabel>
                    <ComboboxCollection>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                    {index < items.length - 1 && <ComboboxSeparator />}
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FormBase>
  );
};

export default FormGroupedCombobox;
