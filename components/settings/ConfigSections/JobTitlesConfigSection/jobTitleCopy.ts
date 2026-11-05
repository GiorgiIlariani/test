import { FieldEditorCopy, FieldEditorToggle } from 'hooks/Settings/useConfigFieldEditor';

const duplicateMessage = 'A job title with this name already exists.';

export const jobTitleToggleCopy: FieldEditorToggle = {
  label: 'Seniority applicable',
  description:
    'Enable when this title is combined with seniority levels on rate cards. Turn off when the title is used on its own.',
};

export const jobTitleFieldCopy = (mode: 'create' | 'edit'): FieldEditorCopy => ({
  title: mode === 'edit' ? 'Edit job title' : 'Add job title',
  fieldLabel: 'Job title',
  requiredMessage: 'Enter a job title.',
  submitLabel: mode === 'edit' ? 'Save changes' : 'Add job title',
  duplicateMessage,
  toggle: jobTitleToggleCopy,
});

export const jobTitleDeleteLabel = 'job title';
