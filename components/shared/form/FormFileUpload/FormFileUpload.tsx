import { FormBase, FileUpload } from 'components';
import { FormFileUploadProps } from './types';

const FormFileUpload: React.FC<FormFileUploadProps> = ({
  name,
  label,
  description,
  required = false,
  disabled = false,
  wrapperClassName,
  labelClassName,
  uploaderClassName,
  onChange: customOnChange,
  rules,
  ...uploaderProps
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
        <FileUpload
          {...uploaderProps}
          id={field.name}
          name={field.name}
          value={field.value ?? []}
          disabled={disabled}
          required={required}
          aria-invalid={fieldState.invalid}
          className={uploaderClassName}
          onBlur={field.onBlur}
          onChange={(files) => {
            field.onChange(files);
            customOnChange?.(files);
          }}
        />
      )}
    </FormBase>
  );
};

export default FormFileUpload;
