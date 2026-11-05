import React from 'react';
import { useInvoiceEmailVariableSuggestions } from './useInvoiceEmailVariableSuggestions';
import {
  FormBase,
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  TinyMCE,
} from 'components';
import { addVariableAutocompleter, invoiceVariablePattern } from './helpers';

type InvoiceEmailVariableFieldProps = {
  name: string;
  label: string;
  disabled?: boolean;
  multiline?: boolean;
  required?: boolean;
  height?: number;
  needsLoader?: boolean;
};

const InvoiceEmailVariableField: React.FC<InvoiceEmailVariableFieldProps> = ({
  name,
  label,
  disabled = false,
  multiline = false,
  required = false,
  height = 260,
  needsLoader = false,
}) => {
  const {
    inputRef,
    highlightsOverlayRef,
    suggestions,
    dismissSuggestions,
    updateSuggestions,
    insertVariable,
  } = useInvoiceEmailVariableSuggestions();

  if (multiline) {
    return (
      <TinyMCE
        inputName={name}
        labelName={label}
        height={height}
        canNotEdit={disabled}
        doesNotNeedScrollObserver
        needsLoader={needsLoader}
        required={required}
        extraInitConfiguration={{ setup: addVariableAutocompleter }}
      />
    );
  }

  return (
    <FormBase
      name={name}
      label={label}
      description='Type @ to insert an invoice variable. Variables are filled in when the email is sent.'
      required={required}
      disabled={disabled}
    >
      {({ field, fieldState }) => {
        return (
          <Combobox<string>
            items={suggestions}
            filter={null}
            value={null}
            inputValue={field.value ?? ''}
            open={suggestions.length > 0 && !disabled}
            openOnInputClick={false}
            autoHighlight
            disabled={disabled}
            onOpenChange={(open) => {
              if (!open) dismissSuggestions();
            }}
            onValueChange={(variable, details) => {
              // Insert into the template instead of replacing the whole subject.
              details.cancel();
              if (variable) insertVariable(variable, field.onChange);
            }}
          >
            <div className='relative'>
              <ComboboxInput
                {...field}
                ref={(element) => {
                  field.ref(element);
                  inputRef.current = element;
                }}
                id={field.name}
                value={field.value ?? ''}
                aria-invalid={fieldState.invalid}
                showTrigger={false}
                className='w-full'
                disabled={disabled}
                required={required}
                autoComplete='off'
                spellCheck={false}
                onScroll={(event) => {
                  if (highlightsOverlayRef.current) {
                    highlightsOverlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
                  }
                }}
                onChange={(event) => {
                  field.onChange(event);
                  updateSuggestions(event.target.value, event.target.selectionStart ?? 0);
                }}
                onBlur={() => {
                  field.onBlur();
                  dismissSuggestions();
                }}
                onClick={(event) =>
                  updateSuggestions(
                    event.currentTarget.value,
                    event.currentTarget.selectionStart ?? 0,
                  )
                }
                onKeyUp={(event) => {
                  // Typing is handled above, so only update when the cursor moves.
                  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                    updateSuggestions(
                      event.currentTarget.value,
                      event.currentTarget.selectionStart ?? 0,
                    );
                  }
                }}
              />

              <div
                ref={highlightsOverlayRef}
                aria-hidden='true'
                className={`pointer-events-none absolute inset-0 flex items-center overflow-hidden rounded-lg border border-transparent px-2.5 text-sm text-transparent ${
                  disabled ? 'opacity-50' : ''
                }`}
              >
                <span className='whitespace-pre'>
                  {String(field.value ?? '')
                    .split(new RegExp(`(${invoiceVariablePattern().source})`, 'g'))
                    .map((part, index) =>
                      index % 2 === 1 ? (
                        <mark key={index} className='bg-primary/20 text-transparent'>
                          {part}
                        </mark>
                      ) : (
                        part
                      ),
                    )}
                </span>
              </div>
            </div>

            <ComboboxContent anchor={inputRef} className='w-56 min-w-0'>
              <ComboboxList aria-label='Invoice email variables'>
                {(variable: string) => (
                  <ComboboxItem key={variable} value={variable}>
                    {variable}
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

export default InvoiceEmailVariableField;
