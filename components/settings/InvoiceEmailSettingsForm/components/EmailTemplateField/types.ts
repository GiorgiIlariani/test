type EmailTemplateFieldName =
  | 'initial_subject'
  | 'initial_body'
  | 'follow_up_1_body'
  | 'follow_up_2_body';

export type EmailTemplateFieldProps = {
  name: EmailTemplateFieldName;
  label: string;
  multilineDisabled?: boolean;
  multiline?: boolean;
  required?: boolean;
};
