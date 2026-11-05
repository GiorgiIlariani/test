import { KeyboardEvent, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';
import { Button, FormBase, Input } from 'components';
import { cn } from 'lib/utils';
import { FormTagsInputProps } from './types';

const FormTagsInput: React.FC<FormTagsInputProps> = ({
  name,
  id,
  label,
  description,
  info,
  required = false,
  disabled = false,
  inputClassName,
  autoComplete = 'off',
  spellCheck = false,
  orientation = 'vertical',
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  rules,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <FormBase
      name={name}
      id={id}
      label={label}
      description={description}
      info={info}
      required={required}
      disabled={disabled}
      orientation={orientation}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
      rules={rules}
    >
      {({ field, fieldState }) => {
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        const addTag = () => {
          const tag = inputValue.trim();

          if (!tag) {
            return;
          }

          field.onChange([...tags, tag]);
          setInputValue('');
        };

        const removeTag = (index: number) => {
          field.onChange(tags.filter((_, tagIndex) => tagIndex !== index));
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === ',' || event.key === ';' || event.key === 'Enter') {
            event.preventDefault();
            addTag();
          } else if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
            event.preventDefault();
            setInputValue(tags[tags.length - 1].slice(0, -1));
            removeTag(tags.length - 1);
          }
        };

        return (
          <div
            className={cn(
              'flex min-h-8 cursor-text flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
              tags.length > 0 ? 'px-1' : 'px-2.5',
              fieldState.invalid && 'border-destructive ring-destructive/20',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={() => inputRef.current?.focus()}
          >
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className='inline-flex h-5.5 max-w-full items-center gap-1 rounded-sm bg-muted pl-1.5 text-xs font-medium'
              >
                <span className='truncate'>{tag}</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-xs'
                  className='size-5 shrink-0 rounded-sm text-muted-foreground'
                  disabled={disabled}
                  onClick={() => removeTag(index)}
                >
                  <XIcon className='size-3' />
                </Button>
              </span>
            ))}

            <Input
              {...inputProps}
              ref={inputRef}
              id={id ?? field.name}
              name={field.name}
              value={inputValue}
              autoComplete={autoComplete}
              spellCheck={spellCheck}
              placeholder={tags.length === 0 ? inputProps.placeholder : undefined}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              required={required}
              className={cn(
                'field-sizing-content h-5.5 w-auto max-w-full rounded-none border-0 bg-transparent p-0 shadow-none focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent aria-invalid:border-0 aria-invalid:ring-0 dark:aria-invalid:border-0 dark:aria-invalid:ring-0',
                inputClassName,
              )}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={(event) => {
                field.onBlur();

                if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
                  addTag();
                }
              }}
            />
          </div>
        );
      }}
    </FormBase>
  );
};

export default FormTagsInput;
