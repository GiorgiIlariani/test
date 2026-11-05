import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from 'components';
import type { EmailSettingsSectionProps } from './types';

const EmailSettingsSection: React.FC<EmailSettingsSectionProps> = ({
  title,
  description,
  disabled,
  children,
}) => (
  <FieldSet disabled={disabled} className='rounded-lg border bg-background p-6 pt-1'>
    <FieldLegend>{title}</FieldLegend>
    <FieldDescription className='mb-2.5'>{description}</FieldDescription>
    <FieldGroup>{children}</FieldGroup>
  </FieldSet>
);

export default EmailSettingsSection;
