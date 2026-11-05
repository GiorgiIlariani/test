import { useConfigFieldEditor } from 'hooks/Settings/useConfigFieldEditor';
import { ListType } from 'types';
import { useConfigSectionSearch } from '../ConfigSectionSearch';
import { deleteTarget } from '../deleteFieldTarget';
import { useDepartmentTableDrag } from '../useDepartmentTableDrag';
import { departmentDeleteLabel, departmentFieldCopy } from './departmentCopy';
import { Props } from './types';

const departmentId = (department: ListType) => Number(department.itemId ?? department.id);

export const useDepartmentsConfigSection = ({
  fields,
  onReorder,
  onDelete,
  onSave = async () => undefined,
  loading,
}: Props) => {
  const { search, setSearch, visibleItems: visibleDepartments } = useConfigSectionSearch(fields);
  const { onDragEnd, isDragDisabled } = useDepartmentTableDrag({ search, onReorder });
  const { editor, submitting, openEditor, closeEditor, submitEditor } = useConfigFieldEditor(
    fields,
    onSave,
  );

  const handleSubmit = async (value: { title: string; enabled: boolean }) => {
    const result = await submitEditor(value);
    if (result.status === 'error') return result.message;
    if (result.status === 'success' && result.created) setSearch('');
  };

  const billableCount = fields.filter((department) => department.is_billable).length;

  const openCreate = () =>
    openEditor({
      mode: 'create',
      name: '',
      enabled: true,
      copy: departmentFieldCopy('create'),
    });

  const openEdit = (department: ListType) =>
    openEditor({
      mode: 'edit',
      id: departmentId(department),
      name: department.title || '',
      enabled: !!department.is_billable,
      copy: departmentFieldCopy('edit'),
    });

  const deleteDepartment = (department: ListType) =>
    onDelete(deleteTarget(department, departmentDeleteLabel));

  return {
    search,
    setSearch,
    visibleDepartments,
    onDragEnd,
    dragDisabled: isDragDisabled || loading,
    actionsDisabled: loading,
    billableCount,
    nonBillableCount: fields.length - billableCount,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreate,
    openEdit,
    deleteDepartment,
  };
};
