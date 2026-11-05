import { FieldEditorToggle } from 'hooks/Settings/useConfigFieldEditor';

export type FormValues = {
  title: string;
  enabled: boolean;
};

export type Props = {
  title: string;
  description?: string;
  fieldLabel: string;
  initialValue?: string;
  initialEnabled?: boolean;
  toggle?: FieldEditorToggle;
  requiredMessage?: string;
  submitLabel?: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (value: { title: string; enabled: boolean }) => Promise<string | void>;
};

export type ConfigFieldModalArgs = Pick<
  Props,
  'initialValue' | 'initialEnabled' | 'submitting' | 'onClose' | 'onSubmit'
>;
