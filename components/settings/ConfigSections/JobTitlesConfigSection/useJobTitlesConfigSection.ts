import { useConfigFieldEditor } from 'hooks/Settings/useConfigFieldEditor';
import { ListType } from 'types';
import { useConfigSectionSearch } from '../ConfigSectionSearch';
import { deleteTarget } from '../deleteFieldTarget';
import { useDepartmentTableDrag } from '../useDepartmentTableDrag';
import { jobTitleDeleteLabel, jobTitleFieldCopy } from './jobTitleCopy';
import { Props } from './types';

const jobTitleId = (jobTitle: ListType) => Number(jobTitle.itemId ?? jobTitle.id);

export const useJobTitlesConfigSection = ({
  fields,
  onReorder,
  onDelete,
  onSave = async () => undefined,
  loading,
}: Props) => {
  const { search, setSearch, visibleItems: visibleJobTitles } = useConfigSectionSearch(fields);
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

  const applicableCount = fields.filter((jobTitle) => jobTitle.seniority_applicable).length;

  const openCreate = () =>
    openEditor({
      mode: 'create',
      name: '',
      enabled: true,
      copy: jobTitleFieldCopy('create'),
    });

  const openEdit = (jobTitle: ListType) =>
    openEditor({
      mode: 'edit',
      id: jobTitleId(jobTitle),
      name: jobTitle.title || '',
      enabled: !!jobTitle.seniority_applicable,
      copy: jobTitleFieldCopy('edit'),
    });

  const deleteJobTitle = (jobTitle: ListType) =>
    onDelete(deleteTarget(jobTitle, jobTitleDeleteLabel));

  return {
    search,
    setSearch,
    visibleJobTitles,
    onDragEnd,
    dragDisabled: isDragDisabled || loading,
    actionsDisabled: loading,
    applicableCount,
    notApplicableCount: fields.length - applicableCount,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreate,
    openEdit,
    deleteJobTitle,
  };
};
