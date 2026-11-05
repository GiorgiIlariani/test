import { FieldEditorCopy } from 'hooks/Settings/useConfigFieldEditor';

const duplicateMessage = 'A seniority level with this name already exists.';

const levelCopy = (mode: 'create' | 'edit'): FieldEditorCopy => ({
  title: mode === 'edit' ? 'Edit seniority level' : 'Add seniority level',
  fieldLabel: 'Seniority level name',
  requiredMessage: 'Enter a seniority level name.',
  submitLabel: mode === 'edit' ? 'Save changes' : 'Add seniority level',
  duplicateMessage,
});

const childCopy = (mode: 'create' | 'edit'): FieldEditorCopy => ({
  title: mode === 'edit' ? 'Edit child level' : 'Add child level',
  fieldLabel: 'Child level name',
  requiredMessage: 'Enter a child level name.',
  submitLabel: mode === 'edit' ? 'Save changes' : 'Add child level',
  duplicateMessage,
});

export const seniorityFieldCopy = {
  level: { create: levelCopy('create'), edit: levelCopy('edit') },
  child: { create: childCopy('create'), edit: childCopy('edit') },
};

export const seniorityDeleteLabel = {
  level: 'seniority level',
  child: 'child level',
};
