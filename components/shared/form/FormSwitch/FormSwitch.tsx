import { FormBase, Switch } from 'components';
import { FormSwitchProps } from './types';

const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  label,
  description,
  required = false,
  disabled = false,
  wrapperClassName,
  labelClassName,
  switchClassName,
  onCheckedChange: customOnCheckedChange,
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
      {({ field, fieldState }) => (
        <Switch
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
          className={switchClassName}
        />
      )}
    </FormBase>
  );
};

export default FormSwitch;
