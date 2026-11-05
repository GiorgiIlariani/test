import { AvatarUpload, FormBase } from 'components';
import { FormAvatarUploadProps } from './types';

const FormAvatarUpload: React.FC<FormAvatarUploadProps> = ({
  name,
  label,
  description,
  required = false,
  disabled = false,
  wrapperClassName,
  labelClassName,
  avatarClassName,
  alt,
  direction,
  onChange: customOnChange,
  rules,
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
        <AvatarUpload
          id={field.name}
          name={field.name}
          value={field.value}
          label=''
          alt={alt}
          direction={direction}
          disabled={disabled}
          required={required}
          aria-invalid={fieldState.invalid}
          className={avatarClassName}
          onBlur={field.onBlur}
          onChange={(file) => {
            field.onChange(file);
            customOnChange?.(file);
          }}
        />
      )}
    </FormBase>
  );
};

export default FormAvatarUpload;
