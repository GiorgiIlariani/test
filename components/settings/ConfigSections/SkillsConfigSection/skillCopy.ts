import { FieldEditorCopy } from 'hooks/Settings/useConfigFieldEditor';

const duplicateMessage = 'A skill with this name already exists.';

export const skillFieldCopy = (mode: 'create' | 'edit'): FieldEditorCopy => ({
  title: mode === 'edit' ? 'Edit skill' : 'Add skill',
  fieldLabel: 'Skill name',
  requiredMessage: 'Enter a skill name.',
  submitLabel: mode === 'edit' ? 'Save changes' : 'Add skill',
  duplicateMessage,
});

export const skillDeleteLabel = 'skill';
