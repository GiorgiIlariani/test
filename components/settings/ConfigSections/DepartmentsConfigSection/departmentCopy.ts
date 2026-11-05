import { FieldEditorCopy, FieldEditorToggle } from 'hooks/Settings/useConfigFieldEditor';

const duplicateMessage = 'A department with this name already exists.';

export const departmentToggleCopy: FieldEditorToggle = {
  label: 'Billable department',
  description:
    'Enable for departments that perform billable client work. Turn off for internal, non-billable departments.',
};

export const departmentFieldCopy = (mode: 'create' | 'edit'): FieldEditorCopy => ({
  title: mode === 'edit' ? 'Edit department' : 'Add department',
  fieldLabel: 'Department name',
  requiredMessage: 'Enter a department name.',
  submitLabel: mode === 'edit' ? 'Save changes' : 'Add department',
  duplicateMessage,
  toggle: departmentToggleCopy,
});

export const departmentDeleteLabel = 'department';
