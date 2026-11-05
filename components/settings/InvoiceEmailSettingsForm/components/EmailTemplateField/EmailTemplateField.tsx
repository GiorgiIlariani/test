import { InvoiceEmailVariableField } from 'components';
import { EmailTemplateFieldProps } from './types';

const EmailTemplateField: React.FC<EmailTemplateFieldProps> = ({
  name,
  label,
  multilineDisabled = false,
  multiline = false,
  required = false,
}) => {
  return (
    <InvoiceEmailVariableField
      name={name}
      label={label}
      height={260}
      disabled={multilineDisabled}
      multiline={multiline}
      required={required}
    />
  );
};

export default EmailTemplateField;
